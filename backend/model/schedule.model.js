const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const scheduleModel = mongoose.model("schedule", scheduleSchema);

module.exports = {
    scheduleModel
}
