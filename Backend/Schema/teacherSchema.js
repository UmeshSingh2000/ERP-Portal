const mongoose = require('mongoose')
const {Schema} = mongoose

const teacher = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:Buffer
    },
    teacherId :{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['teacher']
    }
},{
    timestamps:true
})

const teacherModel = mongoose.model('Teacher',teacher)
module.exports = teacherModel;