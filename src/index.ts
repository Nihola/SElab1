import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- TYPES --------------------
interface Grade {
    course: string;
    grade: string;
}

interface Student {
    studentID: number;
    studentName: string;
}

interface Transcript {
    student: Student;
    grades: Grade[];
}

// -------------------- SAMPLE DATABASE --------------------
let transcripts: Transcript[] = [
    { student: { studentID: 1, studentName: "Sardor" }, grades: [] },
    { student: { studentID: 2, studentName: "Jasur" }, grades: [] },
    { student: { studentID: 3, studentName: "Jasur" }, grades: [] },
    { student: { studentID: 4, studentName: "Nigora" }, grades: [] }
];

// -------------------- ROUTES --------------------

// POST /grades → add grade
app.post("/grades", (req: Request, res: Response) => {
    console.log("✅ POST /grades body:", req.body); // debug
    const { studentID, course, grade } = req.body;

    const transcript = transcripts.find(t => t.student.studentID === studentID);
    if (!transcript) {
        return res.status(404).json({ error: "Student not found" });
    }

    const newGrade: Grade = { course, grade };
    transcript.grades.push(newGrade);

    res.json({
        message: "Grade added successfully",
        transcript
    });
});

// GET /transcripts/:id → by student ID
app.get("/transcripts/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const transcript = transcripts.find(t => t.student.studentID === id);

    if (!transcript) {
        return res.status(404).json({ error: "Transcript not found" });
    }

    res.json(transcript);
});

// GET /studentids?name=theName
app.get("/studentids", (req: Request, res: Response) => {
    const studentName = req.query.name as string;
    if (!studentName) {
        return res.status(400).json({ error: "Missing query parameter: name" });
    }

    const ids = transcripts
        .filter(t => t.student.studentName === studentName)
        .map(t => t.student.studentID);

    res.json({ name: studentName, ids });
});

// DELETE /transcripts/:id
app.delete("/transcripts/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = transcripts.findIndex(t => t.student.studentID === id);

    if (index === -1) {
        return res.status(404).json({ error: "Transcript not found" });
    }

    transcripts.splice(index, 1);
    res.json({ message: `Transcript ${id} deleted` });
});

// Root
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Transcript Manager API 🚀");
});

// -------------------- START SERVER --------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
