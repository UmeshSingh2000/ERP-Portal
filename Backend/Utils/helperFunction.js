const bcrypt = require('bcrypt')
const student = require('../Schema/studentSchema')
const teacher = require('../Schema/teacherSchema')
const nodemailer = require('nodemailer')
require('dotenv').config()
/**
 * @function hashPassword
 * @description Create Hashed password
 * @param {string} password
 * @returns {string} - Returns hashed password
*/
const hashPassword = async (password) => {
    password = password.toString()
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


const checkStudentExist = async (id) => {
    try {
        const isStudent = await student.exists({ _id: id });
        return isStudent;
    } catch (error) {
        console.error("Error checking student existence:", error);
        throw new Error("Unable to check student existence");
    }
}
const checkTeacherExist = async (id) => {
    try {
        const isTeacher = await teacher.exists({ _id: id });
        return isTeacher;
    } catch (error) {
        console.error("Error checking teacher existence:", error);
        throw new Error("Unable to check teacher existence");
    }
}

/**
 * @function capitalize
 * @description Capitalize the string
 * @param {string} - String to be capitalized
 * @returns {string} - Returns capitalized string
*/

const capitalize = (str) => {
    return str.toUpperCase();
}

/**
 * @function seperateString
 * @description Seperate string by comma
 * @param {string} - String to be seperated
 * @returns {array} - Reaturns array of strings
*/


const seperateString = (str) => {
    return str.split(',');
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        })
        return { success: true };
    }
    catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error };
    }
}

module.exports = {
    hashPassword,
    comparePass,
    checkStudentExist,
    checkTeacherExist,
    capitalize,
    seperateString,
    sendMail
}