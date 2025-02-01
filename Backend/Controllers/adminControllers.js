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
        const { email, password, role, name } = req.body
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
            fullName: name
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
const adminDashboard = async (req, res) => {
    try {
        const { id, role } = req.user
        if (role !== "admin") return res.status(403).json({ message: "Access denied: Admin privileges required." })

        const findAdmin = await admin.findOne({ _id: id })
        if (!findAdmin) return res.status(401).json({ message: "Unauthorized access: Token invalid." })


        res.status(200).json({
            message: "Welcome to Dashboard", admin: {
                email: findAdmin.email,
                role: findAdmin.role,
                name: findAdmin.fullName,
                profile: findAdmin.photo ? `/admin/getProfile/${id}` : null
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Error accessing admin dashboard', error: e.message });
    }
}



/**
 * @description Access the admin profile
 * @route POST /api/admin/getProfile/:id
 * @access Public
 */
const getAdminProfile = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "Please provide an ID" })
        const findAdmin = await admin.findOne({ _id: id })
        if (!findAdmin) return res.status(404).json({ message: "Admin not found" })

        res.set('Content-Type', findAdmin.photoType)
        res.send(findAdmin.photo);
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}



/**
 * @description Update the admin profile picture
 * @returns {Promise<void>} - A promise that resolves when the profile picture is updated.
 *
 * @throws {Error} - If there is an internal server error.
 */
const setAdminPicture = async (req, res) => {
    try {
        const { id, role } = req.user
        if (!req.file) return res.status(400).json({ message: "Please upload a file" })

        const photo = req.file.buffer;
        const imageType = req.file.mimetype;
        if (role !== "admin") return res.status(403).json({ message: "Access denied: Admin privileges required." })

        const findAdmin = await admin.findOne({ _id: id })
        if (!findAdmin) return res.status(401).json({ message: "Unauthorized access: Token invalid." })

        findAdmin.photo = photo
        findAdmin.photoType = imageType
        await findAdmin.save()
        res.status(200).json({ message: "Profile picture updated" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}




module.exports = {
    createAdmin,
    adminLogin,
    adminDashboard,
    setAdminPicture,
    getAdminProfile
}