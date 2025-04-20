const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['sick', 'casual', 'vacation'],
        required: true
    },
    leaveDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Leave = mongoose.model('Leave', LeaveSchema);
module.exports = Leave;