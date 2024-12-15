const express = require('express')
const {authenticateToken} = require('../Middelwares/jwtMiddleware') //JWT Token Verification for Authentication
const router = express.Router();
const {
    createAdmin,
    adminLogin,
    adminDashboard,
} = require('../Controllers/adminControllers') //Controllers for Admin

const {
    addStudent
} = require('../Controllers/studentControllers') //Controllers for Student

const {
    addTeacher
} = require('../Controllers/teacherControllers')

/**
 * @route POST /api/admin
 * @description Create a new admin
 * @access Public
 */
router.post('/admin',createAdmin)

/**
 * @route POST /api/admin/login
 * @description Login an admin
 * @access Public
 */
router.post('/admin/login',adminLogin)

/**
 * @route GET /api/admin/dashboard
 * @description Get admin dashboard (protected route)
 * @access Protected (required valid token)
 */
router.get('/admin/dashboard',authenticateToken,adminDashboard)

/**
 * @route POST /api/admin/addStudent
 * @description Add a new student (protected route)
 * @access Protected (required valid token)
 */
router.post('/admin/addStudent',authenticateToken,addStudent)

/**
 * @route POST /api/admin/addTeacher
 * @description Add a new Teacher (protected route)
 * @access Protected (required valid token)
 */
router.post('/admin/addTeacher',authenticateToken,addTeacher)

module.exports = router