const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtpEmail, sendPasswordResetEmail } = require("../config/mailer");
require('dotenv').config();

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getPasswordIssue(password) {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password)) return "Password must include a lowercase letter";
    if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must include a number";
    return null;
}

const registration = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    const passwordIssue = getPasswordIssue(password);
    if (passwordIssue) {
        return res.status(400).send({ message: passwordIssue });
    }

    try {
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        bcrypt.hash(password, 5, async function (err, hash) {
            if (err) {
                return res.status(500).send({ message: "There was an error creating the account" });
            } else {
                const otp = generateOtp();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

                const user = new userModel({
                    fullName,
                    email,
                    password: hash,
                    isVerified: false,
                    otp,
                    otpExpiry
                });
                await user.save();

                try {
                    await sendOtpEmail(email, fullName, otp);
                } catch (mailError) {
                    return res.status(500).send({ message: "Account created, but the verification email could not be sent. Try resending the code.", error: mailError.message });
                }

                res.status(200).send({ message: "Registration successful. Check your email for a verification code.", email, otpExpiresInSeconds: 600 });
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).send({ message: "Email and code are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "No account found for this email" });
        }

        if (user.isVerified) {
            return res.status(400).send({ message: "Account already verified" });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).send({ message: "No verification code on file. Request a new one." });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).send({ message: "This code has expired. Request a new one." });
        }

        if (user.otp !== otp) {
            return res.status(400).send({ message: "Incorrect code" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).send({ message: "Account verified. You can now log in." });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "No account found for this email" });
        }

        if (user.isVerified) {
            return res.status(400).send({ message: "Account already verified" });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await sendOtpEmail(email, user.fullName, otp);
        } catch (mailError) {
            return res.status(500).send({ message: "Could not send the email. Try again in a moment.", error: mailError.message });
        }

        res.status(200).send({ message: "A new code has been sent to your email.", otpExpiresInSeconds: 600 });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });

        // Don't reveal whether an account exists for this email — same
        // response either way, so this endpoint can't be used to check
        // who is or isn't a registered user.
        if (!user) {
            return res.status(200).send({ message: "If an account exists for this email, a reset code has been sent.", otpExpiresInSeconds: 600 });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        try {
            await sendPasswordResetEmail(email, user.fullName, otp);
        } catch (mailError) {
            return res.status(500).send({ message: "Could not send the reset email. Try again in a moment.", error: mailError.message });
        }

        res.status(200).send({ message: "If an account exists for this email, a reset code has been sent.", otpExpiresInSeconds: 600 });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).send({ message: "Email, code, and new password are required" });
    }

    const passwordIssue = getPasswordIssue(newPassword);
    if (passwordIssue) {
        return res.status(400).send({ message: passwordIssue });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid or expired code" });
        }

        if (!user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).send({ message: "No reset code on file. Request a new one." });
        }

        if (user.resetOtpExpiry < new Date()) {
            return res.status(400).send({ message: "This code has expired. Request a new one." });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).send({ message: "Incorrect code" });
        }

        bcrypt.hash(newPassword, 5, async function (err, hash) {
            if (err) {
                return res.status(500).send({ message: "There was an error resetting your password" });
            }
            user.password = hash;
            user.resetOtp = undefined;
            user.resetOtpExpiry = undefined;
            await user.save();
            res.status(200).send({ message: "Password reset. You can now log in with your new password." });
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).send({ message: "Please verify your email before logging in.", needsVerification: true, email: user.email });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Internal Server Error" });
            }
            if (result) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
                res.status(200).send({ message: "Login successful", token, fullName: user.fullName });
            } else {
                res.status(400).send({ message: "Invalid email or password" });
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.headers.userId).select("-password -otp -otpExpiry");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    registration,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    userLogin,
    getProfile
}
