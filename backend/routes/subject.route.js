const express = require("express");
const { createSubject, getSubjects, updateSubject, deleteSubject } = require("../controller/subject.controller");
const { authCheck } = require("../middleware/auth");

const subjectRouter = express.Router();

subjectRouter.post("/subjects", authCheck, createSubject);
subjectRouter.get("/subjects", authCheck, getSubjects);
subjectRouter.put("/subjects/:id", authCheck, updateSubject);
subjectRouter.delete("/subjects/:id", authCheck, deleteSubject);

module.exports = {
    subjectRouter
}
