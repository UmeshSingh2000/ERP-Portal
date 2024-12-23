/**
 * @function adminOnly
 * @description Middleware to check if user is an admin
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function to be called
 * @returns {object} - returns response object
 */

const adminOnly = (req,res,next)=>{
    if(req.user.role!='admin'){
        return res.status(403).json({message:"Access Denied: Admin privileges required."})
    }
    next();
}

module.exports = adminOnly