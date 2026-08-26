const { subjectModel } = require("../model/subject.model");

const createSubject = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.headers.userId;

    if (!name) {
        return res.status(400).send({ message: "Subject name is required" });
    }

    try {
        const subject = new subjectModel({ name, description, userId });
        await subject.save();
        res.status(201).send(subject);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const getSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel.find({ userId: req.headers.userId });
        res.status(200).send(subjects);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const updateSubject = async (req, res) => {
    try {
        const subject = await subjectModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.headers.userId },
            req.body,
            { new: true }
        );
        if (!subject) return res.status(404).send({ message: "Subject not found" });
        res.status(200).send(subject);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const deleteSubject = async (req, res) => {
    try {
        const subject = await subjectModel.findOneAndDelete({ _id: req.params.id, userId: req.headers.userId });
        if (!subject) return res.status(404).send({ message: "Subject not found" });
        res.status(200).send({ message: "Subject deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
}
