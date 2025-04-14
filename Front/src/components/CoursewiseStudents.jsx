import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
const apiUrl = import.meta.env.VITE_API_URL;


const CoursewiseStudents = () => {
    const teacherCourse = JSON.parse(localStorage.getItem('teacher')).course
    const teacherSubjects = JSON.parse(localStorage.getItem('teacher')).subjects
    const [data, setData] = useState([])
    const getCurseWiseStudents = async () => {
        try {

            const response = await axios.post(`${apiUrl}/teacher/getCourseWiseStudent`, { course: teacherCourse, subjects: teacherSubjects }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setData(response.data.courseWiseData)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getCurseWiseStudents()
    }, [])
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default CoursewiseStudents
