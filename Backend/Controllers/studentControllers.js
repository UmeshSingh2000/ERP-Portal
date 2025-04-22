const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//student schema
const student = require('../Schema/studentSchema')

const Leave = require('../Schema/LeaveSchema')

const Course = require('../Schema/courseSchema')

//helper function
const { hashPassword, comparePass, capitalize, seperateString, sendMail } = require('../Utils/helperFunction')

//jwt token generator
const { generateToken } = require('../JWT/jwtToken')



/**
 * @description Add a new student (Admin only)
 * @route POST /api/admin/addStudent
 * @access Private
 */
const addStudent = async (req, res) => {
    try {
        let { name, email, password, role, studentId, course, subjects } = req.body
        //checking all required fields
        if (!name || !email || !password || !role || !studentId || !course || !subjects) return res.status(400).json({ message: "All Fields are mandetory" })

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })

        //checking if the student exist with the same email and studentId
        const existingStudent = await student.findOne({ $or: [{ email }, { studentId }] });
        if (existingStudent) return res.status(400).json({ message: "Student with this email or ID already exists" });

        //capitalize name
        studentId = capitalize(studentId);

        //spliting subjects by comma 
        // subjects = seperateString(subjects)

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
        //get the template
        let template = fs.readFileSync(path.join(__dirname, "../Utils/emailTemplate.html"), 'utf-8')
        template = template
            .replace('{{name}}', name)
            .replace('{{username}}', studentId)
            .replace('{{password}}', password);
        await sendMail({
            to: email,
            subject: "Your Account Credentials",
            html: template
        })
        return res.status(200).json({ message: "Student Added Successfully" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}


const multipleAddStudent = async (req, res) => {
    try {
        const { students } = req.body;

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: "Invalid student data provided." });
        }

        // Format and validate each student
        const formattedStudents = await Promise.all(
            students.map(async (student) => {
                const hashedPassword = await hashPassword(student.password.toString());
                return {
                    ...student,
                    subjects: typeof student.subjects === 'string'
                        ? student.subjects.split(',').map(subject => subject.trim())
                        : student.subjects,
                    password: hashedPassword
                };
            })
        );

        // Insert students, skipping duplicates
        const result = await student.insertMany(formattedStudents, { ordered: false });

        res.status(201).json({
            message: `Successfully added ${result.length} students.`,
            insertedCount: result.length
        });
    } catch (err) {
        // console.error("Error occurred:", err);

        if (err.code === 11000) {
            // Handle duplicate key error (studentId or email conflicts)
            return res.status(409).json({ message: "Duplicate student detected.", error: err.keyValue });
        }

        res.status(500).json({ message: "Server error occurred.", error: err.message });
    }
};








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
 * @description Delete multiple Student (Admin Only)
 * @route DELETE /api/admin/delete-multipleStudent/:studentId
 * @access Private
 */
//deleting multiple record insure that the studentIds are in array
const deleteMultipleStudent = async (req, res) => {
    const { studentsIds } = req.params; // this comes as a string format
    //convert the string to array 
    const studentIdsArray = studentsIds.split(',')

    const objectIds = studentIdsArray.map((id) => new mongoose.Types.ObjectId(id))
    try {
        const deletedStudent = await student.deleteMany({ _id: { $in: objectIds } })
        if (!deletedStudent) {
            return res.status(404).json({ message: "Teacher not found" })
        }
        res.status(200).json({ message: "Student deleted successfully", deletedStudent })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server error", error: err.message })
    }
}










/**
 * @description Update Student record (Admin and student)
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
        //spliting subjects by comma
        if (updatedData.subjects && typeof updatedData.subjects === 'string') {
            updatedData.subjects = seperateString(updatedData.subjects)
        }
        if (updatedData.password) {
            updatedData.password = await hashPassword(updatedData.password)
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


/**
 * @description Login Student
 * @routes POST /api/student/login
 * @access Public
 */
const login = async (req, res) => {
    try {
        //acquiring studentId and password from request body
        const { studentId, password } = req.body;
        if (!studentId || !password) return res.status(400).json({ message: "Please provide all required fields" })

        const isStudent = await student.findOne({ studentId });
        if (!isStudent) return res.status(401).json({ message: "Student with this ID does not exist" });

        //comparing password
        const validPass = await comparePass(password, isStudent.password);
        if (!validPass) return res.status(401).json({ message: "Invalid Password" });

        //generate token
        const token = await generateToken(isStudent._id, isStudent.role);
        return res.status(200).json({ message: "Login Successful", token })
    }
    catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
}

/**
 * @description Student Dashboard
 * @routes POST /api/student/dashboard
 * @access Private
 */
const studentDashboard = async (req, res) => {
    try {
        const { id, role } = req.user
        if (role !== 'student') {
            return res.status(403).json({ message: "Access Denied" })
        }
        const studentData = await student.findById(id, '-password -__v -createdAt -updatedAt').lean()
        if (!studentData) {
            return res.status(404).json({ message: "Student not found" })
        }
        res.status(200).json({
            id: studentData._id,
            name: studentData.name,
            email: studentData.email,
            studentId: studentData.studentId,
            course: studentData.course,
            subjects: studentData.subjects,
            profile: studentData.photo ? `/student/getProfile/${id}` : null
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


const verifyPassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { password } = req.body;

        if (!password) return res.status(400).json({ message: "Please provide password" })
        const findStudent = await student.findById(id)

        if (!findStudent) return res.status(404).json({ message: "Student not found" })
        const checkPassword = await comparePass(password, findStudent.password)

        if (!checkPassword) return res.status(400).json({ message: "Wrong Password" })
        res.status(200).json({ message: "Password verified" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @description Update the student profile picture
 * @returns {Promise<void>} - A promise that resolves when the profile picture is updated.
 *
 * @throws {Error} - If there is an internal server error.
 */
const setStudentPicture = async (req, res) => {
    try {
        const { id, role } = req.user
        if (!req.file) return res.status(400).json({ message: "Please upload a file" })

        if (role !== "student") return res.status(403).json({ message: "Access denied: Student privileges required." })
        const photo = req.file.buffer;
        const imageType = req.file.mimetype;

        const findStudent = await student.findOne({ _id: id })
        if (!findStudent) return res.status(401).json({ message: "Unauthorized access: Token invalid." })

        findStudent.photo = photo
        findStudent.photoType = imageType
        await findStudent.save()
        res.status(200).json({ message: "Profile picture updated" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getStudentProfile = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Please provide an ID" })
        const findStudent = await student.findById(id)
        if (!findStudent) return res.status(404).json({ message: "Student not found" })

        res.set('Content-Type', findStudent.photoType)
        res.send(findStudent.photo);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


const applyLeave = async (req, res) => {
    try {
        const { studentId, course, leaveType, leaveDate, reason } = req.body;

        // Check required fields
        if (!studentId || !course || !leaveType || !leaveDate || !reason) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const courseId = await Course.findOne({ courseCode: course });
        if (!courseId) {
            return res.status(400).json({ message: "Invalid course ID." });
        }

        // Check if leave already exists for the given date
        const existingLeave = await Leave.findOne({ studentId, leaveDate });
        if (existingLeave) {
            return res.status(400).json({ message: "Leave already exists for this date." });
        }

        // Create new leave entry
        const newLeave = new Leave({
            studentId,
            course: courseId._id,
            leaveType,
            leaveDate,
            reason
        });

        const savedLeave = await newLeave.save();

        res.status(201).json({ message: "Leave applied successfully.", leave: savedLeave });
    } catch (error) {
        console.error("Error applying leave:", error.message);
        res.status(500).json({ message: "Server error. Could not apply for leave.", error: error.message });
    }
};



// Controller to get a leave by ID
const getLeavesByStudent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Student ID is required." });
        }

        // Find all leaves for the given student
        const leaves = await Leave.find({
            studentId: id
        })
            .populate('course', 'courseCode courseName') // Optional: Populate course info
            .sort({ leaveDate: -1 }); // Sort by most recent leave

        if (leaves.length === 0) {
            return res.status(404).json({ message: "No leave applications found for this student." });
        }

        res.status(200).json({ message: "Leaves fetched successfully.", leaves });
    } catch (error) {
        console.error("Error fetching leaves:", error.message);
        res.status(500).json({ message: "Server error. Could not fetch leaves.", error: error.message });
    }
};



/**
 * @description Fetch All student record (Admin Only)
 * @route PUT /api/admin/getStudents
 * @access Private
 */
const getStudent = async (req, res) => {
    try {
        //fetch student exluding those fields
        const students = await student.find({}, '-password -__v -createdAt -updatedAt -role');
        res.status(200).json({ students })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}






module.exports = {
    addStudent,
    deleteStudent,
    updateStudent,
    login,
    getStudent,
    deleteMultipleStudent,
    multipleAddStudent,
    studentDashboard,
    verifyPassword,
    setStudentPicture,
    getStudentProfile,
    applyLeave,
    getLeavesByStudent
}