const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { subjectRouter } = require("./routes/subject.route");
const { taskRouter } = require("./routes/task.route");
const { scheduleRouter } = require("./routes/schedule.route");
const { dashboardRouter } = require("./routes/dashboard.route");
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h2 style="color:teal; text-align:center">Welcome to Study Planner Server</h2>`);
});

app.use("/api", userRouter);
app.use("/api", subjectRouter);
app.use("/api", taskRouter);
app.use("/api", scheduleRouter);
app.use("/api", dashboardRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connection
        console.log("connection created between server and DB")
    } catch (error) {
        console.log(error)
    }
    console.log("Server is running on port", PORT)
})
