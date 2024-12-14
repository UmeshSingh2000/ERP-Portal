const admin = require('../Schema/adminSchema')
const bcrypt = require('bcrypt')
const { generateToken } = require('../JWT/jwtToken')
const student = require('../Schema/studentSchema')

//validate email module
const { isValidEmail } = require('../Utils/validationUtils')
//helper functions
const {hashPassword,comparePass} = require('../Utils/helperFunction')


//@dec create new admin
//method POST
//API: /api/admin
//Access : Public
const createAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body
        //checking all fields that are required
        if (!email || !password || !role) return res.status(400).json({ message: 'Please provide all required fields' })

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })


        //finding if admin already exist :if exist return
        const isAdmin = await admin.findOne()
        if (isAdmin) return res.status(400).json({ message: 'Admin already exist' })

        //hashing password to stored in db using bcrypt
        const hashedPass = await hashPassword(password)

        //create and save new admin
        const newAdmin = new admin({
            email,
            password: hashedPass,
            role
        })

        //saving the admin data to db 
        await newAdmin.save()
        res.status(201).json({
            message: "admin created", newAdmin: {
                email,
                role
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error creating admin', error: e.message });
    }
}


//desc login to admin
//method POST
//API: /api/admin
//Access :Public 
const adminLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        const isAdmin = await admin.findOne({ email })
        //checking all fields that are required
        if (!isAdmin) return res.status(401).json({ message: "Email does not exist" })

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })

        //comparing passwords
        const isPasswordCorrect = await comparePass(password,isAdmin.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Wrong password" })

        //generate JWT
        const token = generateToken(isAdmin._id, isAdmin.role)
        return res.status(200).json({
            message: "Login Success",
            token
        })
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
}


//@desc admin dashboard
//method POST -------------(fix this later)--------------
//API: /api/admin/dashboard
//Access :Private
const adminDashboard = (req, res) => {
    res.status(200).json({ message: "Welcome to Admin Dashboard" })
}


//@desc admin dashboard add student
//method POST
//API: /api/admin/addstudent
//Access :Private
const addStudent = async (req, res) => {
    const { name, email, password, role, studentId, course } = req.body
    //checking all required fields
    if (!name || !email || !password || !role || !studentId || !course) return res.status(400).json({ message: "All Fields are mandetory" })
    
    //email validate format
    const emailValid = isValidEmail(email);
    if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })
    try {
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
    createAdmin,
    adminLogin,
    adminDashboard,
    addStudent
}