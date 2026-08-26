const express = require("express");
const { getDashboard } = require("../controller/dashboard.controller");
const { authCheck } = require("../middleware/auth");

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", authCheck, getDashboard);

module.exports = {
    dashboardRouter
}
