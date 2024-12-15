const bcrypt = require('bcrypt')

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

module.exports = {
    hashPassword,
    comparePass
}