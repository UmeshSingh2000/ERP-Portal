const Subject = require('../Schema/subjectSchema')
const mongoose = require('mongoose')




/**
 * @function createSubject
 * @description Add a new subject
 */
const addSubject = async (req, res) => {
    try {
        const { name, code } = req.body
        if (!name || !code) {
            return res.status(400).json({ message: 'Subject name and subject code are required' });
        }
        const isExist = await Subject.findOne({
            $or: [{ subjectName: name }, { subjectCode: code }]
        })
        if (isExist) {
            return res.status(400).json({ message: 'Subject with this name or code already exists' });
        }
        const newSubject = new Subject({
            subjectName: name, subjectCode: code
        })
        await newSubject.save();
        res.status(201).json({ message: 'Subject created successfully', subject: newSubject });

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}


const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
        res.status(200).json({ subjects })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id required" })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Id" })
        }
        const deletedSubject = await Subject.findByIdAndDelete(id)

        if (!deletedSubject) {
            res.status(404).json({ message: "Subject not found" })
        }

        res.status(200).json({ message: "Subject Deleted Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateSubject = async (req, res) => {
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
        await Subject.findByIdAndUpdate(id, updatedBody, { new: true })
        res.status(200).json({ message: "Subject Updated Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}




module.exports = {
    addSubject,
    getSubjects,
    deleteSubject,
    updateSubject
}
