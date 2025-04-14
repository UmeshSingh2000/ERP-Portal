const { checkStudentExist } = require('../Utils/helperFunction');
const Attendance = require('../Schema/attendanceSchema');
const Course = require('../Schema/courseSchema')
const Subject = require('../Schema/subjectSchema')

/**
 * @description Mark Student Attendance (Teacher Only)
 * @route PUT /api/teacher/attendance/mark
 * @access Private
 */
const markAttendance = async (req, res) => {
    try {
        let { students, courseId, subjectId, marked_by, date } = req.body;

        if (!students || !Array.isArray(students) || students.length === 0 || !courseId || !subjectId || !marked_by || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        courseId = await Course.findOne({ courseCode: courseId });
        subjectId = await Subject.findOne({ subjectName: subjectId });

        const attendanceResults = [];

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        for (const student of students) {
            const { student_id, status } = student;

            const studentExist = await checkStudentExist(student_id);
            if (!studentExist) {
                attendanceResults.push({ student_id, success: false, message: "Student not found" });
                continue;
            }
            const existingAttendance = await Attendance.findOne({
                student_id,
                courseId: courseId._id,
                subjectId: subjectId._id,
                date: attendanceDate
            });

            if (existingAttendance) {
                attendanceResults.push({ student_id, success: false, message: "Already marked" });
                continue;
            }

            const newAttendance = new Attendance({
                student_id,
                courseId,
                subjectId,
                status,
                marked_by,
                date: attendanceDate
            });

            await newAttendance.save();
            attendanceResults.push({ student_id, success: true });
        }

        return res.status(201).json({ message: "Attendance processed", results: attendanceResults });

    } catch (err) {
        console.error("Error marking attendance:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = { markAttendance };
