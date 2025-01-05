const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./blog.db");

// Create the blog_posts table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);
});

// this will execute the database
module.exports = db;
