// This is my server file to manage my blog postdata.
const express = require("express");
const app = express();
const port = 3030;

// Middleware for static type files such as css and js file.
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary storage for blog posts
let blogPosts = [
  {
    id: 1,
    title: "Blog Post Title 1",
    content: "This is the content of blog post 1.",
  },
  {
    id: 2,
    title: "Blog Post Title 2",
    content: "This is the content of blog post 2.",
  },
];

// CODE FOR ROUTE

// Now add the routing such as home, blog, etc. By using the routes as slashes.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/blogs", (req, res) => {
  const blogListHTML = blogPosts
    .map(
      (post) => `
      <article class="blog-item">
        <h2>${post.title}</h2>
        <p>${post.content.substring(0, 100)}...</p>
        <a href="/blog/${post.id}" class="btn">Read More</a>
      </article>
    `
    )
    .join("");

  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/css/styles.css">
        <title>Blog List</title>
      </head>
      <body>
        <header>
          <h1>Dynamic Blogs</h1>
        </header>
        <main>
          <section class="blog-list">
            ${blogListHTML}
          </section>
          <form action="/blogs" method="POST" class="blog-form">
            <input type="text" name="title" placeholder="Blog Title" required />
            <textarea name="content" placeholder="Blog Content" required></textarea>
            <button type="submit" class="btn">Add Blog Post</button>
          </form>
        </main>
      </body>
    </html>
  `);
});

app.get("/blog/:id", (req, res) => {
  const blogPost = blogPosts.find(
    (post) => post.id === parseInt(req.params.id)
  );
  if (blogPost) {
    res.send(`
      <html>
        <head>
          <title>${blogPost.title}</title>
        </head>
        <body>
          <h1>${blogPost.title}</h1>
          <p>${blogPost.content}</p>
        </body>
      </html>
    `);
  } else {
    res.status(404).send("Blog post not found");
  }
});

app.post("/blogs", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: blogPosts.length + 1,
    title,
    content,
  };
  blogPosts.push(newPost);
  res.redirect("/blogs");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
