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
        <form action="/blog/${post.id}" method="POST" class="inline-form">
          <button type="submit" class="btn delete-btn">Delete</button>
        </form>
        <a href="/edit/${post.id}" class="btn edit-btn">Edit</a>
      </article>
    `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blog List</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <header>
          <h1>InsightHub</h1>
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

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const blogPost = blogPosts.find((post) => post.id === postId);

  if (blogPost) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Edit Blog Post</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <header>
            <h1>Edit Blog Post</h1>
          </header>
          <main>
            <form action="/edit/${blogPost.id}" method="POST" class="blog-form">
              <input type="text" name="title" value="${blogPost.title}" required />
              <textarea name="content" required>${blogPost.content}</textarea>
              <button type="submit" class="btn">Update Post</button>
            </form>
          </main>
        </body>
      </html>
    `);
  } else {
    res.status(404).send("Blog post not found");
  }
});

app.post("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;

  const blogPost = blogPosts.find((post) => post.id === postId);
  if (blogPost) {
    blogPost.title = title;
    blogPost.content = content;
    res.redirect("/blogs");
  } else {
    res.status(404).send("Blog post not found");
  }
});

app.get("/blog/:id", (req, res) => {
  const blogPost = blogPosts.find(
    (post) => post.id === parseInt(req.params.id)
  );
  if (blogPost) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${blogPost.title}</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <header>
            <h1>${blogPost.title}</h1>
            <p><strong>Post ID:</strong> ${blogPost.id}</p>
          </header>
          <main>
            <article>
              <p>${blogPost.content}</p>
            </article>
            <a href="/blogs" class="btn">Back to Blog List</a>
          </main>
        </body>
      </html>
    `);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 Not Found</title>
        </head>
        <body>
          <h1>404 - Blog Post Not Found</h1>
          <a href="/blogs" class="btn">Back to Blog List</a>
        </body>
      </html>
    `);
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

app.post("/blog/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  blogPosts = blogPosts.filter((post) => post.id !== postId);
  res.redirect("/blogs");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
