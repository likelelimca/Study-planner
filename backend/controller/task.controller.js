const { taskModel } = require("../model/task.model");

const createTask = async (req, res) => {
    const { title, description, deadline, priority, subjectId } = req.body;
    const userId = req.headers.userId;

    if (!title || !subjectId) {
        return res.status(400).send({ message: "Title and subjectId are required" });
    }

    try {
        const task = new taskModel({ title, description, deadline, priority, subjectId, userId });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const getTasks = async (req, res) => {
    try {
        const filter = { userId: req.headers.userId };
        if (req.query.subjectId) filter.subjectId = req.query.subjectId;
        if (req.query.completed !== undefined) filter.completed = req.query.completed === "true";

        const tasks = await taskModel.find(filter).populate("subjectId", "name");
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await taskModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.headers.userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).send({ message: "Task not found" });
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({ _id: req.params.id, userId: req.headers.userId });
        if (!task) return res.status(404).send({ message: "Task not found" });
        res.status(200).send({ message: "Task deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}
