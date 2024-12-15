//Teacher Schema
const teacher = require('../Schema/teacherSchema')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//helper functions
const { hashPassword, comparePass } = require('../Utils/helperFunction')

/**
 * @description Add a new Teacher (Admin Only)
 * @route POST /api/admin/addTeacher
 * @access Private
 */
const addTeacher = async (req, res) => {
    try {


        const userRole = req.user.role
        if (userRole != 'admin') {
            return res.status(403).json({ message: "Access Denied: Only admins can add teachers." })
        }
        const { name, email, teacherId, password, role } = req.body
        if (!name || !email || !password || !teacherId || !role) {
            return res.status(400).json({ message: "All Fields are mandetory" })
        }

        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format"})
        const newTeacher = new teacher({
            name,
            email,
            password: await hashPassword(password),
            role,
            teacherId
        })
        await newTeacher.save();
        return res.status(200).json({ message: "Teacher Added Successfully" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}


module.exports = {
    addTeacher
}