const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    student_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'students', 
        required: true 
    },

    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'courses', 
        required: true 
    },
    subjectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'subjects', 
        required: true 
    },

    status: {
        type: String,
        enum: ['Present', 'Absent'], 
        required: true,
        default: 'Absent'
    },

    marked_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'teachers', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true, 
        default: Date.now 
    }
}, {
    timestamps: true
});

attendanceSchema.index({ date: 1, courseId: 1, subjectId: 1, student_id: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
