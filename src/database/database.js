const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Create table + seed data
async function initDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT FALSE
        )
    `);

    const result = await pool.query("SELECT COUNT(*) FROM tasks");

    if (parseInt(result.rows[0].count) === 0) {
        await pool.query(
            `
            INSERT INTO tasks(title, done)
            VALUES ($1, $2), ($3, $4), ($5, $6)
            `,
            [
                "Learn Node.js", false,
                "Build CRUD API", false,
                "Connect PostgreSQL Database", false
            ]
        );
        console.log("Seed data inserted");
    }
    console.log("Database ready");
}

module.exports = {
    pool,
    initDatabase
};
