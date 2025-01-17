const { generateToken } = require('../JWT/jwtToken')

//Admin Schema
const admin = require('../Schema/adminSchema')




//validate email module
const { isValidEmail } = require('../Utils/validationUtils')

//helper functions
const { hashPassword, comparePass } = require('../Utils/helperFunction')


/**
 * @description Create a new admin account.
 * @route POST /api/admin
 * @access Private
 */
const createAdmin = async (req, res) => {
    try {
        const { email, password, role,name } = req.body
        //checking all fields that are required
        if (!email || !password || !role || !name) return res.status(400).json({ message: 'Please provide all required fields' })

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
            role,
            fullName:name
        })

        //saving the admin data to db 
        await newAdmin.save()
        res.status(201).json({
            message: "admin created", newAdmin: {
                email,
                role,
                name
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error creating admin', error: e.message });
    }
}


/**
 * @description Login an admin account
 * @route POST /api/admin/login
 * @access Public
 */
const adminLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Please provide all required fields' })
    try {
        const isAdmin = await admin.findOne({ email })
        //checking all fields that are required
        if (!isAdmin) return res.status(401).json({ message: "Admin with this Email does not exist" })

        //email validate format
        const emailValid = isValidEmail(email);
        if (!emailValid) return res.status(400).json({ message: "Invalid Email format" })

        //comparing passwords
        const isPasswordCorrect = await comparePass(password, isAdmin.password)
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


/**
 * @description Access the admin dashboard
 * @route POST /api/admin/dashbaord
 * @access Private
 */
const adminDashboard = async(req, res) => {
    const {id,role} = req.user
    if(role!=="admin") return res.status(403).json({message:"Access denied: Admin privileges required."})
    
    const findAdmin = await admin.findOne({_id:id})
    if(!findAdmin) return res.status(401).json({message:"Unauthorized access: Token invalid."})
    
    res.status(200).json({message:"Welcome to Dashboard",admin:{
        email:findAdmin.email,
        role:findAdmin.role,
        name:findAdmin.fullName,
    }})
}




module.exports = {
    createAdmin,
    adminLogin,
    adminDashboard
}