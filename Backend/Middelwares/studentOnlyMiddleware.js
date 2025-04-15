const studentOnly = (req, res, next) => {
    if (!req.user && req.user.role !== 'student') {
        return res.status(403).json({ message: "Access Denied: Student privileges required." })
    }
    next();
}

module.exports = studentOnly;