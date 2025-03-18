const mongoose = require('mongoose')
//Teacher Schema
const teacher = require('../Schema/teacherSchema')

const student = require('../Schema/studentSchema')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//helper functions
const { hashPassword, comparePass, capitalize, seperateString, checkTeacherExist } = require('../Utils/helperFunction')

//jwt token generator
const { generateToken } = require('../JWT/jwtToken')

/**
 * @description Add a new Teacher (Admin Only)
 * @route POST /api/admin/addTeacher
 * @access Private
 */
const addTeacher = async (req, res) => {
    try {
        //checking all required fields
        let { name, email, teacherId, password, role, course, subjects } = req.body
        if (!name || !email || !password || !teacherId || !role || !course || !subjects) {
            return res.status(400).json({ message: "All Fields are mandetory" })
        }

        //spliting subjects by comma 
        subjects = seperateString(subjects)

        //email validate format
        const emailValid = isValidEmail(email);

        //capitalize TeacherId
        teacherId = capitalize(teacherId)
        //check if the teacher exist

        const isTeacher = await teacher.findOne({ $or: [{ email }, { teacherId }] })
        if (isTeacher) return res.status(400).json({ message: "Teacher with this email or ID already exists" })


        //capitalize name
        name = capitalize(name)

        //capitalize course
        course = capitalize(course)

        //spliting course by comma
        course = seperateString(course)

        //if not found
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })

        const newTeacher = new teacher({
            name,
            email,
            password: await hashPassword(password),
            role,
            teacherId,
            course,
            subjects
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
 * @description Add multiple teachers (Admin Only)
 * @route POST /api/admin/add-multipleTeachers
 * @access Private
 */
const multipleAddTeacher = async (req, res) => {
    try {
        const { teachers } = req.body;
        if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
            return res.status(400).json({ message: "Invalid teacher data provided." });
        }

        // Extract emails and teacherIds
        const teacherEmails = teachers.map(t => t.email);
        const teacherIds = teachers.map(t => t.teacherId);

        // Check for existing teachers
        const existingTeachers = await teacher.find({ $or: [{ email: { $in: teacherEmails } }, { teacherId: { $in: teacherIds } }] });

        // Filter out existing teachers
        const newTeachers = teachers.filter(t => !existingTeachers.some(et => et.email === t.email || et.teacherId === t.teacherId));

        if (newTeachers.length === 0) {
            return res.status(409).json({ message: "All provided teachers already exist." });
        }

        // Hash passwords and format data
        const formattedTeachers = await Promise.all(
            newTeachers.map(async (teacher) => {
                const hashedPassword = await hashPassword(teacher.password.toString());
                return {
                    ...teacher,
                    subjects: typeof teacher.subjects === 'string'
                        ? teacher.subjects.split(',').map(subject => subject.trim())
                        : teacher.subjects,
                    course: typeof teacher.course === 'string'
                        ? teacher.course.split(',').map(course => course.trim())
                        : teacher.course,
                    password: hashedPassword
                };
            })
        );

        // Insert new teachers
        const result = await teacher.insertMany(formattedTeachers);

        res.status(201).json({
            message: `Successfully added ${result.length} teachers.`,
            insertedCount: result.length
        });
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Server error occurred.", error: err.message });
    }
};

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
        //checking for valid teacherId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ message: "Invalid teacher ID format" });
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
 * @description Delete multiple Teacher (Admin Only)
 * @route DELETE /api/admin/delete-multipleTeacher/:teacherId
 * @access Private
 */
//deleting multiple record insure that the teacherIds are in array
const deleteMultipleTeacher = async (req, res) => {
    const { teacherIds } = req.params; // this comes as a string format
    //convert the string to array 
    const teacherIdsArray = teacherIds.split(',')

    const objectIds = teacherIdsArray.map((id) => new mongoose.Types.ObjectId(id))
    try {
        const deletedTeacher = await teacher.deleteMany({ _id: { $in: objectIds } })
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
        //checking for valid teacherId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ message: "Invalid teacher ID format" });
        }
        //spliting subjects by comma
        if (updatedData.subjects && typeof updatedData.subjects === 'string') {
            updatedData.subjects = seperateString(updatedData.subjects)
        }

        //split course by comma
        if (updatedData.course && typeof updatedData.course === 'string') {
            updatedData.course = seperateString(updatedData.course)
        }


        //capitalize name
        if (updatedData.teacherId) {
            updatedData.teacherId = capitalize(updatedData.teacherId)
        }

        if (updatedData.password) {
            updatedData.password = await hashPassword(updatedData.password)
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

/**
 * @description Teacher Login
 * @route POST /api/teacher/login
 * @access Public
 */

const teacherLogin = async (req, res) => {
    //acquiring credential from body
    const { teacherId, password } = req.body
    if (!teacherId || !password) return res.status(400).json({ message: "Please provide all required fields" })

    try {
        //finding teacher with teacherId
        const isTeacher = await teacher.findOne({ teacherId });
        if (!isTeacher) return res.status(401).json({ message: "Teacher with this ID does not exist" });

        //comparing the stored password and provided password
        const checkPassword = await comparePass(password, isTeacher.password);
        if (!checkPassword) return res.status(400).json({ message: "Wrong Password" });

        //genarate JWT token
        const token = await generateToken(isTeacher._id, isTeacher.role)
        //sending message and token
        res.status(200).json({
            message: "Login Success",
            token
        })
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "An error occurred during login" });
    }
}


const teacherDashboard = async (req, res) => {
    try {
        const { id, role } = req.user
        if (role !== 'teacher') {
            return res.status(403).json({ message: "Access Denied" })
        }
        const teacherData = await teacher.findById(id, '-password -__v -createdAt -updatedAt').lean()
        if (!teacherData) {
            return res.status(404).json({ message: "Teacher not found" })
        }
        res.status(200).json({
            id: teacherData._id,
            name: teacherData.name,
            email: teacherData.email,
            teacherId: teacherData.teacherId,
            course: teacherData.course,
            subjects: teacherData.subjects,
            profile: teacherData.photo ? `/teacher/getProfile/${id}` : null
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

/**
 * @description Update the teacher profile picture
 * @returns {Promise<void>} - A promise that resolves when the profile picture is updated.
 *
 * @throws {Error} - If there is an internal server error.
 */
const setTeacherPicture = async (req, res) => {
    try {
        const { id, role } = req.user
        if (!req.file) return res.status(400).json({ message: "Please upload a file" })

        if (role !== "teacher") return res.status(403).json({ message: "Access denied: Teacher privileges required." })
        const photo = req.file.buffer;
        const imageType = req.file.mimetype;

        const findTeacher = await teacher.findOne({ _id: id })
        if (!findTeacher) return res.status(401).json({ message: "Unauthorized access: Token invalid." })

        findTeacher.photo = photo
        findTeacher.photoType = imageType
        await findTeacher.save()
        res.status(200).json({ message: "Profile picture updated" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Please provide an ID" })
        const findTeacher = await teacher.findById(id)
        if (!findTeacher) return res.status(404).json({ message: "Teacher not found" })

        res.set('Content-Type', findTeacher.photoType)
        res.send(findTeacher.photo);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


const verifyPassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { password } = req.body;

        if (!password) return res.status(400).json({ message: "Please provide password" })
        const findTeacher = await teacher.findById(id)

        if (!findTeacher) return res.status(404).json({ message: "Teacher not found" })
        const checkPassword = await comparePass(password, findTeacher.password)

        if (!checkPassword) return res.status(400).json({ message: "Wrong Password" })
        res.status(200).json({ message: "Password verified" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}




/**
 * @description Fetch all teachers
 * @route GET /api/admin/getTeacher
 * @access Private
 */


const getTeacher = async (req, res) => {
    try {
        //fetch teacher exluding those fields
        const teachers = await teacher.find({}, '-password -__v -createdAt -updatedAt -role -photo -photoType');
        res.status(200).json({ teachers })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}



const getTeacherStudents = async (req, res) => {
    try {
        let { course, subjects } = req.body;
        if (!course || !subjects) {
            return res.status(400).json({ message: "Please provide course and subject" })
        }
        // Ensure course is an array
        if (!Array.isArray(course)) {
            course = [course]; // Convert to array if a single value is provided
        }
        // Ensure subjects is an array
        if (!Array.isArray(subjects)) {
            subjects = [subjects]; // Convert single value to array
        }

        let courseRegexArray = course.map(c => ({
            course: { $regex: new RegExp(`^${c}$`, "i") } // Case-insensitive exact match
        }));

        // Convert teacher's subjects array into regex for case-insensitive search
        let subjectRegexArray = subjects.map(s => ({
            subjects: { $regex: new RegExp(`^${s}$`, "i") } // Case-insensitive exact match
        }));

        let students = await student.find({
            $and: [
                { $or: courseRegexArray }, // Case-insensitive course match
                { $or: subjectRegexArray } // Case-insensitive subjects array match
            ]
        });

        res.status(200).json({ students, message: "Students Fetched..." });
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


module.exports = {
    addTeacher,
    deleteTeacher,
    updateTeacher,
    teacherLogin,
    teacherDashboard,
    getTeacher,
    deleteMultipleTeacher,
    multipleAddTeacher,
    setTeacherPicture,
    getTeacherProfile,
    verifyPassword,
    getTeacherStudents
}