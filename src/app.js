const express = require("express");

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

app.use(express.json());

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use("/auth", authRoutes);
app.use("/public", publicRoutes);
app.use("/protected", protectedRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks", "/auth", "/public", "/protected"]
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

module.exports = app;
