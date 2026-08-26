const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controller/task.controller");
const { authCheck } = require("../middleware/auth");

const taskRouter = express.Router();

taskRouter.post("/tasks", authCheck, createTask);
taskRouter.get("/tasks", authCheck, getTasks);
taskRouter.put("/tasks/:id", authCheck, updateTask);
taskRouter.delete("/tasks/:id", authCheck, deleteTask);

module.exports = {
    taskRouter
}
