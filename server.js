// This is my server file to manage my blog postdata.
const express = require("express");
const app = express();
const port = 3030;
// conecvting to db
const db = require("./database"); // Import the database

// Middleware for static type files such as css and js file.
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CODE FOR ROUTE

// Now add the routing such as home, blog, etc. By using the routes as slashes.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/blogs", (req, res) => {
  db.all("SELECT * FROM blog_posts", [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
      return;
    }

    const blogListHTML = rows
      .map(
        (post) => `
        <article class="blog-item">
          <h2>${post.title}</h2>
          <p>${post.content.substring(0, 100)}...</p>
          <a href="/blog/${post.id}" class="btn view-btn">Read More</a>
          <a href="/edit/${post.id}" class="btn edit-btn">Edit</a>
          <form action="/blog/${post.id}" method="POST" class="inline-form">
            <button type="submit" class="btn delete-btn">Delete</button>
          </form>
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
            <h1>Welcome to InsightHub CMS</h1>
            <p>Explore, create, edit, and manage your blogs in one place.</p>
          </header>
          <main>
            <section class="blog-list">
              ${blogListHTML}
            </section>
            <form action="/blogs" method="POST" class="blog-form">
              <h2>Create a New Blog</h2>
              <input type="text" name="title" placeholder="Blog Title" required />
              <textarea name="content" placeholder="Blog Content" required></textarea>
              <button type="submit" class="btn create-btn">Add Blog Post</button>
            </form>
          </main>
          <footer>
            <p>&copy; 2025 InsightHub CMS. All Rights Reserved.</p>
          </footer>
        </body>
      </html>
    `);
  });
});

app.get("/edit/:id", (req, res) => {
  const postId = req.params.id;

  // Query the database for the blog post
  db.get("SELECT * FROM blog_posts WHERE id = ?", [postId], (err, blogPost) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
      return;
    }

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
});


app.get("/blog/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM blog_posts WHERE id = ?", [id], (err, post) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
      return;
    }

    if (post) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${post.title}</title>
            <link rel="stylesheet" href="/css/styles.css">
          </head>
          <body>
            <header>
              <h1>${post.title}</h1>
              <p>${post.content}</p>
              <a href="/blogs" class="btn">Back to Blog List</a>
            </header>
          </body>
        </html>
      `);
    } else {
      res.status(404).send("Blog post not found");
    }
  });
});

// Create a new blog post
app.post("/blogs", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO blog_posts (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Database error");
      } else {
        res.redirect("/blogs");
      }
    }
  );
});
// Delete a blog post
app.post("/blog/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM blog_posts WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.redirect("/blogs");
    }
  });
});

// Edit a blog post (Update)
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  db.run(
    "UPDATE blog_posts SET title = ?, content = ? WHERE id = ?",
    [title, content, id],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Database error");
      } else {
        res.redirect("/blogs");
      }
    }
  );
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
