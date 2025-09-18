import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let totalPosts = 1;
let availableposts = [];


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


app.get("/", (req,res) => {
    res.redirect("/home");
});

app.get("/home", (req,res) => {
    res.render("home.ejs", { availableposts : availableposts }); 
});

app.get("/about", (req,res) => {
    res.render("about.ejs");
});

app.get("/contact", (req,res) => {
    res.render("contact.ejs");
});

app.post("/contact", (req,res) => {
    res.redirect("/contact");
});


app.get("/create", (req,res) => {
    res.render("create.ejs");
});


app.post("/home", (req,res) => {

    const newEntry = {postNum : totalPosts++, title : req.body.blogTitle, post : req.body.blogPost};
    availableposts.push(newEntry);
    res.redirect("/home"); 
});





app.get("/blog/:id", (req,res) => {
    let postId = parseInt(req.params.id);
    let postToRender = availableposts.find(post => post.postNum === postId);
    if (!postToRender) {
    return res.status(404).send("Post not found");
  }

  res.render("blog.ejs", { post: postToRender });
});

app.post("/blog/:id" , (req,res) => {
    const postID = parseInt(req.params.id);

    const post = availableposts.find(post => post.postNum === postID);
    if(!post) 
        return res.status(404).send("page not found");
    post.title = req.body.blogTitle;
    post.post = req.body.blogPost;

    res.redirect(`/blog/${postID}`);
})


app.post("/blog/:id/delete", (req,res) => {

    let id = parseInt(req.params.id);
    availableposts = availableposts.filter(post => post.postNum != id);

    res.redirect("/");
});


app.post("/blog/:id/update", (req,res) => {
    const postId = parseInt(req.params.id);
    const post = availableposts.find(post => post.postNum === postId);

    if(!post) {
        res.status(404).send("page does not exist");
    }
    
    res.render("edit.ejs", {post : post});
});


app.listen(port, ()=> {
    console.log(`Server running at ${port}`);
});