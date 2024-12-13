const express = require('express')
const {authenticateToken} = require('../Middelwares/jwtMiddleware')
const router = express.Router();
const {createAdmin,adminLogin,adminDashboard} = require('../Controllers/adminControllers')
//create admin
router.post('/admin',createAdmin)
//login admin
router.post('/admin/login',adminLogin)

//protected route(dashboard) :- can only be access if login 
router.post('/admin/dashboard',authenticateToken,adminDashboard)

module.exports = router