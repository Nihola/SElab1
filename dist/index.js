"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// -------------------- SAMPLE DATABASE --------------------
let transcripts = [
    { student: { studentID: 1, studentName: "Sardor" }, grades: [] },
    { student: { studentID: 2, studentName: "Jasur" }, grades: [] },
    { student: { studentID: 3, studentName: "Jasur" }, grades: [] },
    { student: { studentID: 4, studentName: "Nigora" }, grades: [] }
];
// -------------------- ROUTES --------------------
// POST /grades → add grade
app.post("/grades", (req, res) => {
    console.log("✅ POST /grades body:", req.body); // debug
    const { studentID, course, grade } = req.body;
    const transcript = transcripts.find(t => t.student.studentID === studentID);
    if (!transcript) {
        return res.status(404).json({ error: "Student not found" });
    }
    const newGrade = { course, grade };
    transcript.grades.push(newGrade);
    res.json({
        message: "Grade added successfully",
        transcript
    });
});
// GET /transcripts/:id → by student ID
app.get("/transcripts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const transcript = transcripts.find(t => t.student.studentID === id);
    if (!transcript) {
        return res.status(404).json({ error: "Transcript not found" });
    }
    res.json(transcript);
});
// GET /studentids?name=theName
app.get("/studentids", (req, res) => {
    const studentName = req.query.name;
    if (!studentName) {
        return res.status(400).json({ error: "Missing query parameter: name" });
    }
    const ids = transcripts
        .filter(t => t.student.studentName === studentName)
        .map(t => t.student.studentID);
    res.json({ name: studentName, ids });
});
// DELETE /transcripts/:id
app.delete("/transcripts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = transcripts.findIndex(t => t.student.studentID === id);
    if (index === -1) {
        return res.status(404).json({ error: "Transcript not found" });
    }
    transcripts.splice(index, 1);
    res.json({ message: `Transcript ${id} deleted` });
});
// Root
app.get("/", (req, res) => {
    res.send("Welcome to Transcript Manager API 🚀");
});
// -------------------- START SERVER --------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
