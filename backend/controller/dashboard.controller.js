const { subjectModel } = require("../model/subject.model");
const { taskModel } = require("../model/task.model");

const getDashboard = async (req, res) => {
    const userId = req.headers.userId;

    try {
        const subjectCount = await subjectModel.countDocuments({ userId });
        const totalTasks = await taskModel.countDocuments({ userId });
        const completedTasks = await taskModel.countDocuments({ userId, completed: true });
        const pendingTasks = totalTasks - completedTasks;

        const upcomingDeadlines = await taskModel.find({
            userId,
            completed: false,
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 }).limit(5).populate("subjectId", "name");

        res.status(200).send({
            subjectCount,
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            upcomingDeadlines
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    getDashboard
}
