const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendOtpEmail = async (toEmail, fullName, otp) => {
    await transporter.sendMail({
        from: `"Study Planner" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Study Planner verification code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 420px; margin: auto;">
                <h2 style="color:#1B2A4A;">Verify your account</h2>
                <p>Hi ${fullName},</p>
                <p>Your verification code is:</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color:#1B2A4A;">${otp}</p>
                <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
            </div>
        `
    });
};

const sendPasswordResetEmail = async (toEmail, fullName, otp) => {
    await transporter.sendMail({
        from: `"Study Planner" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Reset your Study Planner password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 420px; margin: auto;">
                <h2 style="color:#1B2A4A;">Reset your password</h2>
                <p>Hi ${fullName},</p>
                <p>Use this code to reset your password:</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color:#1B2A4A;">${otp}</p>
                <p>This code expires in 10 minutes. If you didn't request this, your password is still safe — just ignore this email.</p>
            </div>
        `
    });
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail
}
