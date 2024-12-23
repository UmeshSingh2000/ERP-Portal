const mongoose = require('mongoose')
const { Schema } = mongoose

const attendance = new Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId,ref:'Student', required: true }, //link to student
    subject : {
        type: String,
        required: true
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    marked_by:{
        type : mongoose.Schema.Types.ObjectId, //link to teacher
        ref:'Teacher',
        required:true
    }
},{
    timestamps:true
})

const attendanceModel = mongoose.model('Attendance',attendance)
module.exports = attendanceModel