
//Accessing Packages

var express          =  require("express"),
    app              =  express(),
    expressSanitizer =  require("express-sanitizer"),
    bodyParser       =  require("body-parser"),
    mongoose         =  require("mongoose"),
    methodOverride   =  require("method-override");

//Dont need to mention .ejs extesion when refering to some file
app.set("view engine","ejs");

//Essential line to use Body Parser
app.use(bodyParser.urlencoded({extended:true}));

//This line should come after ablove line
//Used to protect from harmful script tags in Blog Body by User

app.use(expressSanitizer());

//Using public Directory
app.use(express.static("public"));

/*Used for Routes other than GET and POST
as HTML dont support other routes
*/
app.use(methodOverride("_method"));

//Connect MongoDb to localhost Server
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser:true ,useUnifiedTopology: true });

/* Latest Syntax to be added to Modifying data 
 in Databse from Code File
 */
mongoose.set('useFindAndModify', false);

//Defining a Schema for our Databse
var blogSchema = new mongoose.Schema({
    
    title : String,
    image : String,
    body  : String,
    created : {type : Date, default:Date.now}
});

//Database MOdel or Collection
var Blog = mongoose.model("Blog", blogSchema);

//HOME PAGE
app.get("/",function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req, res){
    
    //Find all the items in the database
    Blog.find({},function(err,foundBlog){
           
        if(err){
            console.log(err);
        }else{

            res.render("index",{blogs:foundBlog});
        }
    });
    
});

//NEW ROUTE
app.get("/blogs/new",function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
   
    //Refering to text inside the Blog main Body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    //Creates this item in our Database
    Blog.create(req.body.blog,function(err,newBlog){
         if(err){
             res.render("new");
         }else{
             res.redirect("/blogs");
         }
   });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){

    //Finding item by its ID
     Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blogs:foundBlog});
        }
})
  });

//EDIT ROUTE
app.get("/blogs/:id/edit",function (req,res){
    

    Blog.findById(req.params.id,function(err,foundBlog){
           if(err){
               res.redirect("/blogs");
           }else{
               res.render("edit",{blogs:foundBlog});
           }
      });
  });

//UPDATE ROUTE
app.put("/blogs/:id",function (req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updaatedBlog){ 
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
    
    });

//DELETE ROUTE  
app.delete("/blogs/:id", function(req,res){
     
    //Find item by its id and Remove it from Database
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
      });
  });

//Giving Port No. 3000 for our local server to execute
app.listen("3000",function(){

    console.log("BLog Server is Started Now..");

});