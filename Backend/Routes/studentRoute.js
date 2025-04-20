const express = require('express')
const router = express.Router();

//controller for student
const { login, studentDashboard, updateStudent, verifyPassword, setStudentPicture, getStudentProfile } = require('../Controllers/studentControllers');
const studentOnly = require('../Middelwares/studentOnlyMiddleware');
const { authenticateToken } = require('../Middelwares/jwtMiddleware');
const multer = require('multer');
const { getAttendance } = require('../Controllers/attendanceControllers');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })




/**
 * @description Login to Student
 * @route POST /api/student/login
 * @access Public
 */
router.post('/login', login)


/**
 * @description Student Dashboard
 * @route GET /api/student/dashboard
 * @access Private
 */
router.post('/dashboard', authenticateToken, studentOnly, studentDashboard)
router.put('/updateStudent/:studentId', authenticateToken, studentOnly, updateStudent)
router.put('/updateProfile', authenticateToken, studentOnly, upload.single('image'), setStudentPicture)
router.post('/verifyPassword', authenticateToken, studentOnly, verifyPassword)
router.get('/getProfile/:id', getStudentProfile)

/**
 * @description Student Attendance
 * @route GET /api/student/myAttendance
 * @access Private
 */
router.post('/myAttendance', authenticateToken, studentOnly, getAttendance)


module.exports = router;