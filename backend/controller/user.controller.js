const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const registration = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).send({ message: "All fields are required" });
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
                const user = new userModel({ fullName, email, password: hash });
                await user.save();
                res.status(200).send({ message: "Registration completed" });
            }
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
        const user = await userModel.findById(req.headers.userId).select("-password");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    registration,
    userLogin,
    getProfile
}