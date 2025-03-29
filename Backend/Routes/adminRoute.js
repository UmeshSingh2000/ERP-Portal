const express = require('express')
const { authenticateToken } = require('../Middelwares/jwtMiddleware') //JWT Token Verification for Authentication
const adminOnly = require('../Middelwares/adminOnlyMiddelware') //middleware for admin check 
const router = express.Router()

//multer configuration
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })



const {
    createAdmin,
    adminLogin,
    adminDashboard,
    setAdminPicture,
    getAdminProfile,
    updateAdmin,
    getStudentTeacherCount,
    studentPerCourse,
    verifyPassword
} = require('../Controllers/adminControllers') //Controllers for Admin

const {
    addStudent,
    deleteStudent,
    updateStudent,
    getStudent,
    deleteMultipleStudent,
    multipleAddStudent,

} = require('../Controllers/studentControllers') //Controllers for Student

const {
    addTeacher,
    deleteTeacher,
    updateTeacher,
    getTeacher,
    deleteMultipleTeacher,
    multipleAddTeacher
} = require('../Controllers/teacherControllers') //Controllers for Teacher


const { addSubject, getSubjects, deleteSubject, updateSubject } = require('../Controllers/subjectControllers') //subject controller
const { addCourse, getCourses, deleteCourse, updateCourse } = require('../Controllers/courseController')


//admin related routes

/**
 * @description Create a new admin
 * @route POST /api/admin
 * @access Public
 */
router.post('/', createAdmin)

/**
 * @description Login an admin
 * @route POST /api/admin/login
 * @access Public
 */
router.post('/login', adminLogin)

/**
 * @description Get admin dashboard (protected route)
 * @route posta /api/admin/dashboard
 * @access Protected (required valid token)
 */
router.post('/dashboard', authenticateToken, adminOnly, adminDashboard)


/**
 * @description Update Admin Profile Picture (protected route)
 * @route GET /api/admin/updateProfile
 * @access Protected (required valid token)
 */

router.put('/updateProfile', authenticateToken, adminOnly, upload.single('image'), setAdminPicture)
router.get('/getProfile/:id', getAdminProfile)
router.put('/updateAdmin', authenticateToken, adminOnly, updateAdmin)
router.post('/verifyPassword', authenticateToken, adminOnly, verifyPassword)


/**
 * @description Add a new student (protected route)
 * @route POST /api/admin/addStudent
 * @access Protected (required valid token)
 */
router.post('/addStudent', authenticateToken, adminOnly, addStudent)
router.post('/addMultipleStudents', authenticateToken, adminOnly, multipleAddStudent)


/**
 * @description Delete student
 * @route DELETE /api/admin/deleteStudent/:studentId
 * @access Protected (required valid token)
 */
router.delete('/deleteStudent/:studentId', authenticateToken, adminOnly, deleteStudent)
router.delete('/delete-multipleStudent/:studentsIds', authenticateToken, adminOnly, deleteMultipleStudent)

/**
 * @description Update Student
 * @route PUT /api/admin/updateStudent/:studentId
 * @acess Protected (required valid token)
 */
router.put('/updateStudent/:studentId', authenticateToken, adminOnly, updateStudent)


/**
 * @description Add a new Teacher (protected route)
 * @route POST /api/admin/addTeacher
 * @access Protected (required valid token)
 */
router.post('/addTeacher', authenticateToken, adminOnly, addTeacher)
router.post('/addMultipleTeachers', authenticateToken, adminOnly, multipleAddTeacher)


/**
 * @description Delete Teacher (protected route)
 * @route DELETE /api/admin/deleteTeacher/:teacherId
 * @access Protected (required valid token)
 */
router.delete('/deleteTeacher/:teacherId', authenticateToken, adminOnly, deleteTeacher)
router.delete('/delete-multipleTeacher/:teacherIds', authenticateToken, adminOnly, deleteMultipleTeacher)


/**
 * @description Update Teacher(protected Route)
 * @route PUT /api/admin/updateTeacher/:teacherId
 * @acess Protected (required valid token)
 */
router.put('/updateTeacher/:teacherId', authenticateToken, adminOnly, updateTeacher)



/**
 * @description Get Teacher(protected Route)
 * @route GET /api/admin/getTeacher
 * @acess Protected (required valid token)
 */
router.get('/getTeachers', authenticateToken, adminOnly, getTeacher)

router.get('/getStudents', authenticateToken, adminOnly, getStudent)
router.get('/count', authenticateToken, adminOnly, getStudentTeacherCount)
router.get('/student-per-course', authenticateToken, adminOnly, studentPerCourse)



/**
 * @description Subjects Routes
 * @acess Protected (only Admin)
 */
router.post('/addSubject', authenticateToken, adminOnly, addSubject)
router.get('/getSubjects', authenticateToken, adminOnly, getSubjects)
router.delete('/deleteSubject/:id', authenticateToken, adminOnly, deleteSubject)
router.put('/updateSubject/:id', authenticateToken, adminOnly, updateSubject)


/**
 * @description Course Routes
 * @acess Protected (only Admin)
 */
router.post('/addCourse', authenticateToken, adminOnly, addCourse)
router.get('/getCourses', authenticateToken, adminOnly, getCourses)
router.delete('/deleteCourse/:id', authenticateToken, adminOnly, deleteCourse)
router.put('/updateCourse/:id', authenticateToken, adminOnly, updateCourse)



module.exports = router
