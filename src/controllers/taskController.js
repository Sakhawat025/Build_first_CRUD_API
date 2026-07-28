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


module.exports = {
    getTasks,
    getTaskById
};