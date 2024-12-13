const jwt = require('jsonwebtoken')
require('dotenv').config()
//function to generate a JWT

const generateToken=(userId,role)=>{
    const payload = {id:userId,role}
    const secretKey = process.env.JWT_SECRET
    const options = {expiresIn : process.env.JWT_EXPIRES_IN || '1d'}
    return jwt.sign(payload,secretKey,options)
}

module.exports = {generateToken};