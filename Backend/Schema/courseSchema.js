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
    timeRangestamps: true,
})

const Course = mongoose.model('course', courseSchema)
module.exports = Course