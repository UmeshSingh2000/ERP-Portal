const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * Middleware to authenticate JWT Tokens
 * @description Verifies the presence and validate of a JWT token in the `Authorization` header
 * @access Protected route only 
 */
const authenticateToken = (req, res, next) => {
    try {
        //extract token from authorization header
        const token = req.headers.authorization?.split(' ')[1];
        //check of token is missing 
        if (!token) return res.status(401).json({ message: "Access denied.No token provided" })
        
        const secret = process.env.JWT_SECRET
        if(!secret) {
            throw new Error("Server configuration error: JWT_SECRET is missing.");
        }
        const decoded = jwt.verify(token, secret)
        req.user = decoded // Attach decoded payload to the request object
        next() //proceed to next middleware
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}
module.exports = { authenticateToken }