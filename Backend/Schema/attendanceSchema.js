const mongoose = require('mongoose')
const { Schema } = mongoose

const attendance = new Schema({
    student_id: { type: String, required: true }, //foreign key
    subject : {
        type: String,
        required: true
    },
    data:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
})

const attendanceModel = mongoose.model('Attendance',attendance)
module.exports = attendanceModel