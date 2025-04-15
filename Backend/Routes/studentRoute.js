const express = require('express')
const router = express.Router();

//controller for student
const { login, studentDashboard } = require('../Controllers/studentControllers');
const studentOnly = require('../Middelwares/studentOnlyMiddleware');
const { authenticateToken } = require('../Middelwares/jwtMiddleware');

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

module.exports = router;