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
        //checking all required fields
        const { name, email, teacherId, password, role } = req.body
        if (!name || !email || !password || !teacherId || !role) {
            return res.status(400).json({ message: "All Fields are mandetory" })
        }

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })
        const newTeacher = new teacher({
            name,
            email,
            password: await hashPassword(password),
            role,
            teacherId
        })
        //save teacher to to database
        await newTeacher.save();
        return res.status(200).json({ message: "Teacher Added Successfully" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}

/**
 * @description Delete Teacher (Admin Only)
 * @route DELETE /api/admin/deleteTeacher/:teacherId
 * @access Private
 */
const deleteTeacher = async (req, res) => {
    try {
        //acquiring teacherId from params
        const { teacherId } = req.params;
        if (!teacherId) {
            return res.status(400).json({ message: "Please provide teacherId" })
        }

        //delete teacher with teacherID
        const deletedTeacher = await teacher.findByIdAndDelete(teacherId)
        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" })
        }

        res.status(200).json({ message: "Teacher deleted successfully", deletedTeacher })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}

/**
 * @description Update Teacher (Admin Only)
 * @route PUT /api/admin/updateTeacher/:teacherId
 * @access Private
 */
const updateTeacher = async (req, res) => {
    try {
        //acquiring body to be updated 
        const updatedData = req.body
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" })
        }

        //acquiring email from the body and checking the format of the email
        const { email } = updatedData;
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid Email Format" });
        }

        //acquiring teacherId from params
        const { teacherId } = req.params
        if (!teacherId) {
            return req.status(400).json({ message: "Please Provide teacherId" })
        }
        //updating teacher
        const updatedTeacher = await teacher.findByIdAndUpdate(teacherId,
            { $set: updatedData },
            { new: true, runValidators: true }
        )
        //if not found 
        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" })
        }
        return res.status(200).json({ message: 'Teacher updated successfully', updatedTeacher });
    }
    catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
}

module.exports = {
    addTeacher,
    deleteTeacher,
    updateTeacher
}