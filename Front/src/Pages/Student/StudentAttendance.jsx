import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import toastHelper from '@/Helpers/toastHelper'
import { useToast } from '@/hooks/use-toast'
import { setData } from '@/Redux/features/StudentsData/StudentAttendanceSlice'
import axios from 'axios'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const apiUrl = import.meta.env.VITE_API_URL

const StudentAttendance = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const mySubjects = JSON.parse(localStorage.getItem('student')).subjects
    const myAttendance = useSelector((state) => state.studentAttendance.value)
    const [filteredAttendance, setFilteredAttendance] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState('')


    const fetchMyAttendance = async () => {
        const student_id = JSON.parse(localStorage.getItem('student')).id
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/student/myAttendance`, { student_id }, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            // setMyAttendance(response.data.attendance)
            dispatch(setData(response.data.attendance))
            const grouped = groupAttendanceBySubject(response.data.attendance)
            // console.log(response.data.attendance)
            setFilteredAttendance(grouped)
            toastHelper(toast, response.data.message, 'Success')
        }
        catch (err) {
            toastHelper(toast, err.response?.data?.message || 'Failed to fetch attendance', 'error')
        }
        finally {
            setLoading(false)
        }
    }

    const handleApplyFilter = () => {
        if (!selectedSubject) {
            toastHelper(toast, 'Please select a subject', 'Error')
            return
        }
        // const filteredAttendance = myAttendance.filter((attendance) => attendance.subjectId.subjectName === selectedSubject)
        const selectedFilteredAttendance = myAttendance.filter((attendance) => attendance.subjectId.subjectName === selectedSubject)
        const grouped = groupAttendanceBySubject(selectedFilteredAttendance)
        setFilteredAttendance(grouped)
        toastHelper(toast, 'Filter applied successfully', 'Success')
    }


    const groupAttendanceBySubject = (attendanceRecords) => {
        const grouped = {};
        attendanceRecords.forEach((record) => {
            const subjectId = record.subjectId.subjectCode;
            if (!grouped[subjectId]) {
                grouped[subjectId] = {
                    subjectCode: record.subjectId.subjectCode,
                    subjectName: record.subjectId.subjectName,
                    attended: 0,
                    total: 0
                };
            }
            grouped[subjectId].total += 1;
            if (record.status === 'Present') {
                grouped[subjectId].attended += 1;
            }
        })
        return Object.values(grouped);
    }


    const calculateAttendancePercentage = (attended, total) => {
        const result = 0;
        if (total === 0) return result;
        return ((attended / total) * 100).toFixed(2);
    }

    const handleClearFilter = () => {
        setSelectedSubject('');
        const grouped = groupAttendanceBySubject(myAttendance)
        setFilteredAttendance(grouped)
        toastHelper(toast, 'Filter cleared successfully', 'Success')

    }
    useEffect(() => {
        if (myAttendance.length !== 0) {
            const grouped = groupAttendanceBySubject(myAttendance)
            setFilteredAttendance(grouped)
            return
        }
        fetchMyAttendance()
    }, [])
    return (
        <main>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Attendance</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                    See Your Attendance
                </p>
            </header>
            <article className="p-4 md:p-6 lg:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
                    <div className="flex-1">
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {mySubjects.map((subject, index) => {
                                    return (
                                        <SelectItem key={index} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Apply Filter Button */}
                    <Button
                        onClick={handleClearFilter}
                        className="w-full md:w-auto cursor-pointer bg-red-500"
                    >
                        Clear Filter
                    </Button>
                    <Button
                        onClick={handleApplyFilter}
                        className="w-full md:w-auto cursor-pointer"
                    >
                        Apply Filter
                    </Button>
                </div>
                <section className="flex flex-col gap-4 w-full">
                    <div className="overflow-x-auto relative">
                        {loading ? <Loader /> :
                            <div className="w-full">
                                <Table className="hidden sm:table">
                                    <TableCaption>Your Attendance</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">Sno:</TableHead>
                                            <TableHead className="">Subject Id</TableHead>
                                            <TableHead>Subject Name</TableHead>
                                            <TableHead>Attended/Total</TableHead>
                                            <TableHead>Percentage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            filteredAttendance.length > 0 &&
                                            filteredAttendance.map((attendance, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableHead className="w-[50px]">{index + 1}</TableHead>
                                                        <TableHead>{attendance.subjectCode}</TableHead>
                                                        <TableHead>{attendance.subjectName}</TableHead>
                                                        <TableHead>{attendance.attended}/<span className='cursor-pointer hover:text-orange-600'>{attendance.total}</span></TableHead>
                                                        <TableHead
                                                            className={calculateAttendancePercentage(attendance.attended, attendance.total) < 75 ? 'bg-red-500 text-white' : ''}
                                                        >{calculateAttendancePercentage(attendance.attended, attendance.total)}%</TableHead>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        }
                    </div>
                </section>
            </article>
        </main>
    )
}

export default StudentAttendance
