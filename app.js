

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
const { result } = require("lodash");
mongoose.connect('mongodb://localhost:27017/dairyDB')
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// let postsarr=[]
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const postSchema={
  title:String,
  content:String
}
const posts=mongoose.model("posts",postSchema)

app.get("/",(req,res)=>{
  posts.find({},(err,allPost)=>{
    if(err){
      console.log(err);
    }
    else{      
      res.render("home",{posts:allPost})
    }
  })
})

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent:aboutContent})
})

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent:contactContent})
})

app.get("/compose",(req,res)=>{
  res.render("compose")
})

app.get('/posts/:title', (req, res) => {
  const verify=_.lowerCase(req.params.title);
  console.log(req.params)
  posts.find({},(err,allPost)=>{
    if(err){
      console.log(err);
    }
    else{
      for (let i = 0; i < allPost.length; i++) {
        var element = allPost[i].title;
        content=allPost[i].content;
        element=_.lowerCase(element)
        if (verify==element) {
          res.render("post",{header:verify,content:content})
        }
      } 
    }
  })   
})
app.get("/delete/:title",(req,res)=>{
  const verify=req.params.title;
  console.log(verify);
  posts.deleteOne({title:verify},(err,res)=>{
    if(err){
      console.log("err",err);
    }
    else{
      console.log(res);
    }
  })
  res.redirect("/")
})

app.post("/compose",(req,res)=>{
  post=new posts({
    title:req.body.title,
    content:req.body.blog
  })
  post.save((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/")
    }
  })
})
app.post("/post/:title",(req,res)=>{
  const url=_.lowerCase(req.params.title)
  posts.findOne({name:url},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      content=result.content
      res.render('edit',{header:url,content:content})
    }
  })
})
app.post("/edit/:title",(req,res)=>{
  const url=_.lowerCase(req.params.title)
  content=req.body.blog
  console.log(content);
  posts.updateOne({name:url},{content:content},(err)=>{
    if(err){
      console.log(err);
    }
  })
  res.redirect("/")
})
app.listen(3000, ()=> {
  console.log("Server started on port 3000");
});
