const express = require("express");
const { registration, verifyOtp, resendOtp, forgotPassword, resetPassword, userLogin, getProfile } = require("../controller/user.controller");
const { authCheck } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post("/auth/register", registration);
userRouter.post("/auth/verify-otp", verifyOtp);
userRouter.post("/auth/resend-otp", resendOtp);
userRouter.post("/auth/forgot-password", forgotPassword);
userRouter.post("/auth/reset-password", resetPassword);
userRouter.post("/auth/login", userLogin);
userRouter.get("/auth/profile", authCheck, getProfile);

module.exports = {
    userRouter
}
