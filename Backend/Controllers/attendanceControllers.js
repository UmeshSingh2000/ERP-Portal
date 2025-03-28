const {checkStudentExist,checkTeacherExist} = require('../Utils/helperFunction')
const attendance = require('../Schema/attendanceSchema')
/**
 * @description Mark Student Attendance (Teacher Only)
 * @routes PUT /api/teacher/attendance/mark
 * @access Private
 */
const markAttendance = async (req, res) => {
    try {
        //acquiring all fields from request body
        const { student_id, subject, status, marked_by } = req.body //here student_id is mongoid not my custom id also marked_by is teacher mongid
        if (!student_id || !subject  || !status || !marked_by) {
            return res.status(400).json({ message: "All fields are required" })
        }
        //check if the student exist or not for the id provided
        const studentExist = await checkStudentExist(student_id);
        if (!studentExist) {
            return res.status(404).json({ message: "Student not found" })
        }
        //check if the teacher exist or not for the id provided
        const teacherExist = await checkTeacherExist(marked_by);
        if (!teacherExist) {
            return res.status(404).json({ message: "Teacher not found" })
        }
        const newAttendance = new attendance({
            student_id, subject, status, marked_by
        })
        await newAttendance.save()
        return res.status(200).json({ message: "Attendance Marked Successfully", newAttendance })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}
module.exports = { markAttendance }