const express = require("express");

const app = express();


app.use(express.json());

const taskRoutes=require("./routes/taskRoutes");

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