const mongoose = require('mongoose')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//student schema
const student = require('../Schema/studentSchema')

//helper function
const { hashPassword, comparePass } = require('../Utils/helperFunction')

/**
 * @description Add a new student (Admin only)
 * @route POST /api/admin/addStudent
 * @access Private
 */
const addStudent = async (req, res) => {
    try {
        const { name, email, password, role, studentId, course,subjects } = req.body
        //checking all required fields
        if (!name || !email || !password || !role || !studentId || !course || !subjects) return res.status(400).json({ message: "All Fields are mandetory" })

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
            course,
            subjects
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

/**
 * @description Delete Student (Admin Only)
 * @route DELETE /api/admin/deleteStudent/:studentId
 * @access Private
 */
const deleteStudent = async (req, res) => {
    try {
        //acquiring id from req parameter
        const { studentId } = req.params
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" })
        }

        //checking for valid studentId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format" });
        }

        const deletedStudent = await student.findByIdAndDelete(studentId)
        //checking if the student exist with the same studentId
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" })
        }

        return res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
    }
    catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
}

/**
 * @description Update Student record (Admin Only)
 * @routes PUT /api/admin/updateStudent/:studentId
 * @access Private
 */
const updateStudent = async (req, res) => {
    try {
        //acquiring id from request parameter
        const { studentId } = req.params
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" })
        }

        //checking for valid studentId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format" });
        }

        //acquiring updates from request body
        const updatedData = req.body
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
        const { email } = updatedData;
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid Email Format" });
        }
        const updatedStudent = await student.findByIdAndUpdate(studentId,
            { $set: updatedData },
            { new: true, runValidators: true }
        )
        //checking if the student exist with the same studentId
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" })
        }
        return res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    }
    catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
}



module.exports = {
    addStudent,
    deleteStudent,
    updateStudent
}