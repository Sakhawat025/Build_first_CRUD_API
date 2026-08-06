const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../../tasks.db");

const db = new Database(dbPath);

// Create tasks table
db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0
    )
`).run();


// Seed initial tasks only if table is empty

const count = db.prepare(
    "SELECT COUNT(*) AS count FROM tasks"
).get();


if (count.count === 0) {

    const insert = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `);


    insert.run("Learn Node.js", 0);
    insert.run("Build CRUD API", 0);
    insert.run("Connect SQLite Database", 0);

}

module.exports = db;