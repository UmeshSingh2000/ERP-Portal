const express = require('express')
const { authenticateToken } = require('../Middelwares/jwtMiddleware') //JWT Token Verification for Authentication
const adminOnly = require('../Middelwares/adminOnlyMiddelware') //middleware for admin check 
const router = express.Router()
const {
    createAdmin,
    adminLogin,
    adminDashboard,
} = require('../Controllers/adminControllers') //Controllers for Admin

const {
    addStudent,
    deleteStudent,
    updateStudent
} = require('../Controllers/studentControllers') //Controllers for Student

const {
    addTeacher,
    deleteTeacher,
    updateTeacher
} = require('../Controllers/teacherControllers')


//admin related routes

/**
 * @description Create a new admin
 * @route POST /api/admin
 * @access Public
 */
router.post('/admin', createAdmin)

/**
 * @description Login an admin
 * @route POST /api/admin/login
 * @access Public
 */
router.post('/admin/login', adminLogin)

/**
 * @description Get admin dashboard (protected route)
 * @route GET /api/admin/dashboard
 * @access Protected (required valid token)
 */
router.get('/admin/dashboard', authenticateToken, adminDashboard)

/**
 * @description Add a new student (protected route)
 * @route POST /api/admin/addStudent
 * @access Protected (required valid token)
 */
router.post('/admin/addStudent', authenticateToken,adminOnly, addStudent)

/**
 * @description Delete student
 * @route DELETE /api/admin/deleteStudent/:studentId
 * @access Protected (required valid token)
 */
router.delete('/admin/deleteStudent/:studentId', authenticateToken,adminOnly, deleteStudent)

/**
 * @description Update Student
 * @route PUT /api/admin/updateStudent/:studentId
 * @acess Protected (required valid token)
 */
router.put('/admin/updateStudent/:studentId',authenticateToken,adminOnly,updateStudent)


/**
 * @description Add a new Teacher (protected route)
 * @route POST /api/admin/addTeacher
 * @access Protected (required valid token)
 */
router.post('/admin/addTeacher', authenticateToken,adminOnly, addTeacher)

/**
 * @description Delete Teacher (protected route)
 * @route DELETE /api/admin/deleteTeacher/:teacherId
 * @access Protected (required valid token)
 */
router.delete('/admin/deleteTeacher/:teacherId', authenticateToken,adminOnly, deleteTeacher)

/**
 * @description Update Teacher(protected Route)
 * @route PUT /api/admin/updateTeacher/:teacherId
 * @acess Protected (required valid token)
 */
router.put('/admin/updateTeacher/:teacherId',authenticateToken,adminOnly,updateTeacher)
module.exports = router