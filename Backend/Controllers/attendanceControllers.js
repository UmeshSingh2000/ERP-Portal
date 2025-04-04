const { checkStudentExist, checkTeacherExist } = require('../Utils/helperFunction');
const Attendance = require('../Schema/attendanceSchema');

/**
 * @description Mark Student Attendance (Teacher Only)
 * @route PUT /api/teacher/attendance/mark
 * @access Private
 */
const markAttendance = async (req, res) => {
    try {
        // Extracting fields from request body
        const { student_id, courseId, subjectId, status, marked_by } = req.body;

        // Validate required fields
        if (!student_id || !courseId || !subjectId || !status || !marked_by) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate `status` (should be 'Present' or 'Absent')
        if (!['Present', 'Absent'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Check if the student exists
        const studentExist = await checkStudentExist(student_id);
        if (!studentExist) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if the teacher exists
        const teacherExist = await checkTeacherExist(marked_by);
        if (!teacherExist) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Get today's date without time (for uniqueness check)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

        // Check if attendance already exists for today
        const existingAttendance = await Attendance.findOne({ 
            student_id, 
            courseId, 
            subjectId, 
            date: today 
        });

        if (existingAttendance) {
            return res.status(409).json({ message: "Attendance already marked for today" });
        }

        // Create and save new attendance record
        const newAttendance = new Attendance({
            student_id,
            courseId,
            subjectId,
            status,
            marked_by,
            date: today
        });

        await newAttendance.save();

        return res.status(201).json({ message: "Attendance marked successfully", attendance: newAttendance });

    } catch (err) {
        console.error("Error marking attendance:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

module.exports = { markAttendance };
