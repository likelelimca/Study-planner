const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    completed: {
        type: Boolean,
        default: false
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const taskModel = mongoose.model("task", taskSchema);

module.exports = {
    taskModel
}
