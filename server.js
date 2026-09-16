const { initDatabase } = require("./src/database/database");
const app = require("./src/app");

async function startServer() {
    try {
        await initDatabase();
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();
