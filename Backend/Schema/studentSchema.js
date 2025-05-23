const mongoose = require('mongoose')
const {Schema} = mongoose

const student = new Schema({
    name: {
        type: String,required: true
    },
    email: {
        type: String,required: true,
        unique:true
    },
    password :{
        type:String,required:true
    },
    photo:{
        type:Buffer
    },
    role:{
        type:String,required:true,
        enum :['student']
    },
    studentId:{
        type:String,required:true, //primary key
        unique :true
    },
    course :{
        type:String,required:true
    },
    subjects : {
        type:[String],
        required:true
    }
},{
    timestamps: true
})

const studentModel=mongoose.model('students',student)
module.exports = studentModel;