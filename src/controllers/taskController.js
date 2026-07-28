const tasks = require("../models/taskModel");



const getTasks = (req,res)=>{
    res.json(tasks);
};



const getTaskById = (req,res)=>{

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );


    if(!task){
        return res.status(404).json({
            error:`Task ${id} not found`
        });
    }


    res.json(task);

};

const createTask = (req, res) => {

    const { title } = req.body;


    // Validation
    if (!title || title.trim() === "") {

        return res.status(400).json({
            error: "Title is required"
        });

    }


    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };


    tasks.push(newTask);


    res.status(201).json(newTask);

};


module.exports = {
    getTasks,
    getTaskById,
    createTask
};