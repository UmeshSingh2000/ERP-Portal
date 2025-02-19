const mongoose = require('mongoose')
//Teacher Schema
const teacher = require('../Schema/teacherSchema')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//helper functions
const { hashPassword, comparePass,capitalize,seperateString,checkTeacherExist } = require('../Utils/helperFunction')

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
        
        const isTeacher = await teacher.findOne({$or:[{email},{teacherId}]})
        if(isTeacher) return res.status(400).json({message:"Teacher with this email or ID already exists"})

        
        //capitalize name
        name = capitalize(name)

        //capitalize course
        course = capitalize(course)

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

    const objectIds = teacherIdsArray.map((id)=>new mongoose.Types.ObjectId(id))
    try{
        const deletedTeacher = await teacher.deleteMany({_id:{$in:objectIds}})
        if(!deletedTeacher){
            return res.status(404).json({message:"Teacher not found"})
        }
        res.status(200).json({message:"Teacher deleted successfully",deletedTeacher})
    }
    catch(err){
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
        if(updatedData.subjects && typeof updatedData.subjects === 'string'){
            updatedData.subjects = seperateString(updatedData.subjects)
        }

        //capitalize name
        if(updatedData.teacherId){
            updatedData.teacherId = capitalize(updatedData.teacherId)
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

/**
 * @description Fetch all teachers
 * @route GET /api/admin/getTeacher
 * @access Private
 */


const getTeacher = async(req,res)=>{
    try {
        //fetch teacher exluding those fields
        const teachers = await teacher.find({},'-password -__v -createdAt -updatedAt -role');
        res.status(200).json({teachers})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}



module.exports = {
    addTeacher,
    deleteTeacher,
    updateTeacher,
    teacherLogin,
    getTeacher,
    deleteMultipleTeacher
}