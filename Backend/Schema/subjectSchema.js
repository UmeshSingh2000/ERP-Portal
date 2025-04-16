const mongoose = require('mongoose')
const { Schema } = mongoose;

const subjectSchema = new Schema({
    subjectName: {
        type: String,
        required: true,
        unique: true
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true
    },

},{timestamps:true})

const Subject = new mongoose.model('subjects', subjectSchema)
module.exports = Subject