import React from 'react'
import { useSelector } from 'react-redux';
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
const SubjectWiseStudents = () => {
    const data = useSelector(state => state.teacherSubjectWiseStudentNumber.value);
    console.log(data)
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#ab47bc" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default SubjectWiseStudents
