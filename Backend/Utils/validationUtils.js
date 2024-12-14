const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
    Validates if an email is in the correct format.
    returns {boolean} - Returns true if valid, false otherwise.
*/

const isValidEmail = (email)=>{
    return emailRegex.test(email)
}

module.exports = {isValidEmail}