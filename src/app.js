const express = require("express");

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const taskRoutes=require("./routes/taskRoutes");

app.use(express.json());

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


app.use("/tasks",taskRoutes);

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get("/health",(req,res)=>{
    res.json({
        status:"ok"
    });
});


module.exports = app;