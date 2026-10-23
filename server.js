require("dotenv").config();
const { initDatabase } = require("./src/database/database");
require("./src/config/supabase");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        if (process.env.DATABASE_URL) {
            await initDatabase();
        }
    } catch (error) {
        console.warn("Database connection notice:", error.message);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} and connected to Supabase`);
    });
}

startServer();
