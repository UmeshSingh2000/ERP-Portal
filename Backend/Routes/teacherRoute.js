const express = require('express')
const router = express.Router();

//Middlewares
const { authenticateToken } = require('../Middelwares/jwtMiddleware') //JWT Token Verification for Authentication
const teacherOnly = require('../Middelwares/teacherOnlyMiddleware') //middleware for teacher check

//controller for teacher

const {
    teacherLogin,
    teacherDashboard,
    setTeacherPicture,
    getTeacherProfile,
    verifyPassword,
    updateTeacher,
    getTeacherStudents
} = require('../Controllers/teacherControllers')

//controller for attendance
const { markAttendance } = require('../Controllers/attendanceControllers')


//multer configuration
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })




//teacher related Route

/**
 * @description Login to Teacher
 * @route POST /api/teacher/login
 * @access Public
 */
router.post('/login', teacherLogin);



/**
 * @description Teacher Dashboard
 * @route GET /api/teacher/dashboard
 * @access Private
 */
router.post('/dashboard', authenticateToken, teacherOnly, teacherDashboard)

router.post('/myStudents', authenticateToken, teacherOnly, getTeacherStudents)

/**
 * @description Mark attendance (Teacher Only)
 * @route POST /api/teacher/attendance/mark
 * @access Protected (Required Valid token and allowed User(teacher only))
 */
router.put('/attendance/mark', authenticateToken, teacherOnly, markAttendance)


/**
 * @description Set Profile Picture (Teacher Only)
 * @route POST /api/teacher/updateProfile
 * @access Protected (Required Valid token and allowed User(teacher only))
 */

router.put('/updateProfile', authenticateToken, teacherOnly, upload.single('image'), setTeacherPicture)
router.get('/getProfile/:id', getTeacherProfile)
router.post('/verifyPassword', authenticateToken, teacherOnly, verifyPassword)
router.put('/updateTeacher/:teacherId', authenticateToken, teacherOnly, updateTeacher)




module.exports = router;