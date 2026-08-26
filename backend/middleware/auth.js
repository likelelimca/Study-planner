const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user.model");
require('dotenv').config();

const authCheck = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "Unauthorized access" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.status(401).send({ message: "Unauthorized access", error: err.message })
        } else {
            try {
                const user = await userModel.findById(decoded.userId);
                if (user) {
                    req.headers.userId = decoded.userId;
                    next();
                } else {
                    res.status(401).send({ message: "Unauthorized access" })
                }
            } catch (error) {
                res.status(500).send({ message: "Internal server error", error: error.message })
            }
        }
    })
}

module.exports = {
    authCheck
}
