const mongoose = require('mongoose')
require('dotenv').config()
const dbConnect = () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/ERP`)
        console.log('Connected to MongoDB')
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports = dbConnect;