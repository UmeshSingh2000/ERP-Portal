const express = require('express')
const router = express.Router()
const {authenticateToken} = require('../Middelwares/jwtMiddleware')
router.post('/verify-token',authenticateToken,(req,res)=>{
    res.status(200).json({message:"Token is valid"})
})

module.exports=router