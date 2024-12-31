const express = require('express')
const router = express.Router();

//controller for student
const {login} = require('../Controllers/studentControllers')

/**
 * @description Login to Student
 * @route POST /api/student/login
 * @access Public
 */
router.post('/login',login)

module.exports = router;