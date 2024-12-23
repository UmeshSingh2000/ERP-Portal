const express = require('express')
const router = express.Router();

//Middlewares
const { authenticateToken } = require('../Middelwares/jwtMiddleware') //JWT Token Verification for Authentication
const teacherOnly = require('../Middelwares/teacherOnlyMiddleware') //middleware for teacher check

//controller for teacher
const {teacherLogin} = require('../Controllers/teacherControllers')

//teacher related Route

/**
 * @description Login to Teacher
 * @route POST /api/teacher/login
 * @access Public
 */
router.post('/login',teacherLogin);

/**
 * @description Mark attendance (Teacher Only)
 * @route POST /api/teacher/attendance/mark
 * @access Protected (Required Valid token and allowed User(teacher only))
 */
router.post('/attendance/mark',authenticateToken,teacherOnly, (req, res) => {
    res.send('Mark Attendance')
})


module.exports = router;