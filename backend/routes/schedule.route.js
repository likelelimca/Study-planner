const express = require("express");
const { createSchedule, getSchedules, updateSchedule, deleteSchedule } = require("../controller/schedule.controller");
const { authCheck } = require("../middleware/auth");

const scheduleRouter = express.Router();

scheduleRouter.post("/schedules", authCheck, createSchedule);
scheduleRouter.get("/schedules", authCheck, getSchedules);
scheduleRouter.put("/schedules/:id", authCheck, updateSchedule);
scheduleRouter.delete("/schedules/:id", authCheck, deleteSchedule);

module.exports = {
    scheduleRouter
}
