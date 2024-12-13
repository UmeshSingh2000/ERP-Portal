const jwt = require('jsonwebtoken')
require('dotenv').config()

//middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) res.status(401).json({ message: "Access denied.No token provided" })
    try {
        const secret = process.env.JWT_SECRET
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}
module.exports = {authenticateToken}