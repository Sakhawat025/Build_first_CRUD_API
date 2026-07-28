const express = require("express");

const router = express.Router();


const {
    getTasks,
    getTaskById
} = require("../controllers/taskController");


router.get("/", getTasks);

router.get("/:id", getTaskById);


module.exports = router;