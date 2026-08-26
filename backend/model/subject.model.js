const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const subjectModel = mongoose.model("subject", subjectSchema);

module.exports = {
    subjectModel
}
