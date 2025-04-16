const mongoose = require('mongoose')
const { Schema } = mongoose
const courseSchema = new Schema({
    courseName: {
        type: String,
        required: true,
        unique: true,
    },
    courseCode: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
})

const Course = mongoose.model('courses', courseSchema)
module.exports = Course