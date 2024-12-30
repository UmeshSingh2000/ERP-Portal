const mongoose = require('mongoose')
const { Schema } = mongoose

const attendance = new Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId,ref:'Student', required: true }, //link to student : pass here the mongoid not the custom id
    subject : {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    marked_by:{
        type : mongoose.Schema.Types.ObjectId, //link to teacher: pass here the mongoid not the custom id
        ref:'Teacher',
        required:true
    }
},{
    timestamps:true
})

const attendanceModel = mongoose.model('Attendance',attendance)
module.exports = attendanceModel