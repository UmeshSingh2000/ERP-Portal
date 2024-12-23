/**
 * @function teacherOnly
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @param {Function} next - Next Function to be called
 * @description Middleware to check if user is a teacher
 * @returns {Object} - Returns response object
 */

const teacherOnly = (req,res,next)=>{
    if(!req.user || req.user.role!='teacher'){
        return res.status(403).json({message:"Access Denied: Teacher privileges required."})
    }
    next();
}

module.exports = teacherOnly