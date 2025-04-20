const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coordinatorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    courseName: {
        type: String,
        required: true,
        unique: true,
    },

}, [{ timestamps: true }])

const Coordinator = mongoose.model('Coordinator', coordinatorSchema)
module.exports = Coordinator