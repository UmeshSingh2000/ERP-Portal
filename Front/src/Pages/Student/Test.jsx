import React, { useEffect, useState } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setData } from '@/Redux/features/StudentsData/StudentAttendanceSlice'

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from '@/hooks/use-toast';
const apiUrl = import.meta.env.VITE_API_URL


const Test = () => {
    const dispatch = useDispatch()
    const [graphData, setGroupData] = useState()
    const { toast } = useToast();
    const myAttendance = useSelector(state => state.studentAttendance.value)
    const fetchMyAttendance = async () => {
        const student_id = JSON.parse(localStorage.getItem('student')).id
        try {
            const response = await axios.post(`${apiUrl}/student/myAttendance`, { student_id }, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            dispatch(setData(response.data.attendance))
            const grouped = groupAttendanceBySubject(response.data.attendance)
            setGroupData(grouped)
            toastHelper(toast, response.data.message, 'Success')
        }
        catch (err) {
            toastHelper(toast, err.response?.data?.message || 'Failed to fetch attendance', 'error')
        }
    }
    const groupAttendanceBySubject = (attendanceRecords) => {
        const grouped = {};
        attendanceRecords.forEach((record) => {
            const subjectName = record.subjectId.subjectName
            if (!grouped[subjectName]) [
                grouped[subjectName] = {
                    total: 0,
                    attended: 0,
                }
            ]
            grouped[subjectName].total += 1
            if (record.status === 'Present') {
                grouped[subjectName].attended += 1
            }
        })
        const formattedData = Object.keys(grouped).map((subject) => {
            return {
                subject,
                attendance: Math.round((grouped[subject].attended / grouped[subject].total) * 100)
            }
        })
        return formattedData;
    }



    useEffect(() => {
        if (myAttendance.length !== 0) {
            const grouped = groupAttendanceBySubject(myAttendance)
            setGroupData(grouped)
            return
        }
        fetchMyAttendance()
    }, [])
    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Subject-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="attendance"
                            stroke="#4f46e5"
                            fillOpacity={1}
                            fill="url(#colorAttendance)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default Test

