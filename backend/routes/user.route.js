const express = require("express");
const { registration, userLogin, getProfile } = require("../controller/user.controller");
const { authCheck } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post("/auth/register", registration);
userRouter.post("/auth/login", userLogin);
userRouter.get("/auth/profile", authCheck, getProfile);

module.exports = {
    userRouter
}
