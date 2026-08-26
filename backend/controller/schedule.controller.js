const { scheduleModel } = require("../model/schedule.model");

const createSchedule = async (req, res) => {
    const { subjectId, date, startTime, endTime, notes } = req.body;
    const userId = req.headers.userId;

    if (!subjectId || !date || !startTime || !endTime) {
        return res.status(400).send({ message: "subjectId, date, startTime and endTime are required" });
    }

    try {
        const schedule = new scheduleModel({ subjectId, date, startTime, endTime, notes, userId });
        await schedule.save();
        res.status(201).send(schedule);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const getSchedules = async (req, res) => {
    try {
        const schedules = await scheduleModel.find({ userId: req.headers.userId }).populate("subjectId", "name");
        res.status(200).send(schedules);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const updateSchedule = async (req, res) => {
    try {
        const schedule = await scheduleModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.headers.userId },
            req.body,
            { new: true }
        );
        if (!schedule) return res.status(404).send({ message: "Schedule not found" });
        res.status(200).send(schedule);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const schedule = await scheduleModel.findOneAndDelete({ _id: req.params.id, userId: req.headers.userId });
        if (!schedule) return res.status(404).send({ message: "Schedule not found" });
        res.status(200).send({ message: "Schedule deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createSchedule,
    getSchedules,
    updateSchedule,
    deleteSchedule
}
