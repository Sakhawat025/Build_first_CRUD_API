const tasks = require("../models/taskModel");

// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const result = await tasks.query("SELECT * FROM tasks ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET TASK BY ID
const getTaskById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await tasks.query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE TASK
const createTask = async (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const result = await tasks.query(
            "INSERT INTO tasks(title, done) VALUES($1, $2) RETURNING *",
            [title, false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE TASK
const updateTask = async (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;
    try {
        const existing = await tasks.query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        const oldTask = existing.rows[0];
        const newTitle = title !== undefined ? title : oldTask.title;
        const newDone = done !== undefined ? done : oldTask.done;

        const result = await tasks.query(
            "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",
            [newTitle, newDone, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE TASK
const deleteTask = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await tasks.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
