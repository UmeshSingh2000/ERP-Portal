const bcrypt = require('bcrypt')

/**
    Create Hashed password
    returns {boolean} - Returns hashed password
*/
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

/**
    Compare Hashed password
    returns {boolean} - Returns true if valid, false otherwise.
*/
const comparePass = async(password,hashedPassword)=>{
    return await bcrypt.compare(password, hashedPassword)
}
module.exports = {hashPassword,comparePass}