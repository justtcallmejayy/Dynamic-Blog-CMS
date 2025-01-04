// This is my server file to manage my blog postdata.
const express = require("express");
const app = express();
const port = 3030;

// Middleware for static type files such as css and js file.
app.use(express.static("public"));

// Now add the routing such as home, blog, etc. By using the routes as slashes.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/blogs", (req, res) => {
  res.sendFile(__dirname + "/views/blog-list.html");
});

app.get("/blog/:id", (req, res) => {
  res.sendFile(__dirname + "/views/blog-post.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
