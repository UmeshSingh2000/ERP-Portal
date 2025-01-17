const mongoose = require('mongoose')
const { Schema } = mongoose
const admin = new Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,required: true,unique:true
    },
    password: {
        type: String,required: true
    },
    photo:{
        type:Buffer
    },
    role:{
        type:String,required:true,
        enum: ['admin']
    }
},{
    timestamps:true
})

const adminModel = mongoose.model('Admin',admin)

module.exports = adminModel