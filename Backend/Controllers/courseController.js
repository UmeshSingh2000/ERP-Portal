const Course = require('../Schema/courseSchema')
const mongoose = require('mongoose')

/**
 * @function createCourse
 * @description Add a new course
 */
const addCourse = async (req, res) => {
    try {
        const { name, code } = req.body
        if (!name || !code) {
            return res.status(400).json({ message: 'Course name and course code are required' });
        }
        const isExist = await Course.findOne({
            $or: [{ courseName: name }, { courseCode: code }]
        })
        if (isExist) {
            return res.status(400).json({ message: 'Course with this name or code already exists' });
        }
        const newCourse = new Course({
            courseName: name, courseCode: code
        })
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        res.status(200).json({ courses })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id required" })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Id" })
        }
        const deletedCourse = await Course.findByIdAndDelete(id)

        if (!deletedCourse) {
            res.status(404).json({ message: "Course not found" })
        }

        res.status(200).json({ message: "Course Deleted Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBody = req.body;
        if (!id) {
            return res.status(400).json({ message: "Id required" })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Id" })
        }
        if (Object.keys(updatedBody).length === 0) {
            return res.status(400).json({ message: "No data to update" })
        }
        await Course.findByIdAndUpdate(id, updatedBody, { new: true })
        res.status(200).json({ message: "Course Updated Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    addCourse,
    getCourses,
    deleteCourse,
    updateCourse
}