const { isValidEmail } = require('../Utils/validationUtils')
const student = require('../Schema/studentSchema')
const { hashPassword, comparePass } = require('../Utils/helperFunction')

/**
 * @description Add a new student (Admin only)
 * @route POST /api/admin/addStudent
 * @access Private
 */
const addStudent = async (req, res) => {
    try {
        //checking if the user is admin or not
        const userRole = req.user.role;
        if (userRole != 'admin') return res.status(403).json({ message: "Access Denied: Only admins can add students." });

        const { name, email, password, role, studentId, course } = req.body
        //checking all required fields
        if (!name || !email || !password || !role || !studentId || !course) return res.status(400).json({ message: "All Fields are mandetory" })

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })

        //checking if the student exist with the same email and studentId
        const existingStudent = await student.findOne({ $or: [{ email }, { studentId }] });
        if (existingStudent) return res.status(400).json({ message: "Student with this email or ID already exists" });

        //creating new student 
        const newStudent = new student({
            name,
            email,
            password: await hashPassword(password),
            role,
            studentId,
            course
        })
        //save student to to database
        await newStudent.save();
        return res.status(200).json({ message: "Student Added Successfully" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}


module.exports = {
    addStudent
}