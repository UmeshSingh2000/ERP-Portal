const bcrypt = require('bcrypt')
const student = require('../Schema/studentSchema')
const teacher = require('../Schema/teacherSchema')
/**
 * @function hashPassword
 * @description Create Hashed password
 * @param {string} password
 * @returns {string} - Returns hashed password
*/
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

/**
 * @function comparePass
 * @description Compare Hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {boolean} - Returns true if match, false otherwise.
*/
const comparePass = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}


const checkStudentExist=async(id)=>{
    try {
        const isStudent = await student.exists({ _id: id });        
        return isStudent;
    } catch (error) {
        console.error("Error checking student existence:", error);
        throw new Error("Unable to check student existence");
    }
}
const checkTeacherExist=async(id)=>{
    try {
        const isTeacher = await teacher.exists({ _id: id });        
        return isTeacher;
    } catch (error) {
        console.error("Error checking teacher existence:", error);
        throw new Error("Unable to check teacher existence");
    }
}

const capitalize = (str)=>{
    return str.toUpperCase();
}

module.exports = {
    hashPassword,
    comparePass,
    checkStudentExist,
    checkTeacherExist,
    capitalize
}