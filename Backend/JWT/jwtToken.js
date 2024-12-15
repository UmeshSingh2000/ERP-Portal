const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * @function generateToken
 * @description : This function generates a JWT token for a user
 * @param {string} userId : The user's unique identifier to include in the token.
 * @param {string} role :The user's role to include in the token.
 * @returns {string} JWT token
 */

const generateToken = (userId, role) => {
    const payload = { id: userId, role } //payload to send with token 
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
        throw new Error("Server configuration error: JWT_SECRET is missing.");
    }
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    return jwt.sign(payload, secretKey, options)
}

module.exports = { generateToken };