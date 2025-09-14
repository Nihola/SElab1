// src/TranscriptManager.ts

export type StudentID = number;
export type Course = string;

interface Student {
    studentID: StudentID;
    studentName: string;
}

interface Grade {
    course: Course;
    grade: number;
}

interface Transcript {
    student: Student;
    grades: Grade[];
}

let students: Transcript[] = [];
let nextID = 1;

export function initialize() {
    students = [
        { student: { studentID: nextID++, studentName: "Sardor" }, grades: [] },
        { student: { studentID: nextID++, studentName: "Jasur" }, grades: [] },
        { student: { studentID: nextID++, studentName: "Jasur" }, grades: [] },
        { student: { studentID: nextID++, studentName: "Nigora" }, grades: [] },
    ];
}

export function getAll(): Transcript[] {
    return students;
}

export function addStudent(name: string): StudentID {
    const studentID = nextID++;
    students.push({ student: { studentID, studentName: name }, grades: [] });
    return studentID;
}

export function getTranscript(studentID: StudentID): Transcript | undefined {
    return students.find(s => s.student.studentID === studentID);
}

export function getStudentIDs(studentName: string): StudentID[] {
    return students
        .filter(s => s.student.studentName === studentName)
        .map(s => s.student.studentID);
}

export function deleteStudent(studentID: StudentID): void {
    const index = students.findIndex(s => s.student.studentID === studentID);
    if (index === -1) {
        throw new Error(`No student with id=${studentID}`);
    }
    students.splice(index, 1);
}

export function addGrade(studentID: StudentID, course: Course, grade: number): void {
    const transcript = getTranscript(studentID);
    if (!transcript) throw new Error("No such student");
    if (transcript.grades.find(g => g.course === course)) {
        throw new Error("Grade for this course already exists");
    }
    transcript.grades.push({ course, grade });
}

export function getGrade(studentID: StudentID, course: Course): number {
    const transcript = getTranscript(studentID);
    if (!transcript) throw new Error("No such student");
    const grade = transcript.grades.find(g => g.course === course);
    if (!grade) throw new Error("No such grade");
    return grade.grade;
}
