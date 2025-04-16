const mongoose = require('mongoose')
const { Schema } = mongoose

const teacher = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: Buffer
    },
    photoType: {
        type: String
    },
    teacherId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['teacher']
    },
    course: { // course to which the teacher is assigned
        type: [String],
        required: true
    },
    subjects: { // subjects that the teacher can teach
        type: [String],
        required: true
    }
}, {
    timestamps: true
})

const teacherModel = mongoose.model('teachers', teacher)
module.exports = teacherModel;