const tasks = require("../models/taskModel");



const getTasks = (req,res)=>{
    const rows = tasks.prepare(
        "SELECT * FROM tasks"
    ).all();

    res.json(rows);
};



const getTaskById = (req,res)=>{

    const id = Number(req.params.id);

    const task = tasks.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if(!task){
        return res.status(404).json({
            error: `Task ${id} not found`
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


    const result = tasks.prepare(
        `
        INSERT INTO tasks (title, done)
        VALUES (?, ?)

        `
    ).run(title, 0);

    const newTask = tasks.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);


    res.status(201).json(newTask);

};

// Update task
const updateTask = (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const { title, done } = req.body;
    if (title !== undefined) {
        task.title = title;
    }

    if (done !== undefined) {
        task.done = done;
    }
    res.json(task);
};

// Delete task
const deleteTask = (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    tasks.splice(index, 1);
    res.status(204).send();
};



module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};