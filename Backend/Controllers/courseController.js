const Course = require('../Schema/courseSchema')


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

module.exports = {
    addCourse,
    getCourses
}