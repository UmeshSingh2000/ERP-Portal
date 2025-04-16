import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
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
                    subjectName: record .subjectId.subjectName,
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
                                                        <TableHead>{attendance.attended}/<span className='cursor-pointer hover:text-orange-600'>
                                                            <Drawer>
                                                                <DrawerTrigger className="cursor-pointer">
                                                                    {attendance.total}
                                                                </DrawerTrigger>
                                                                <DrawerContent
                                                                    className="fixed inset-0 z-50 p-0 flex items-center justify-center"
                                                                >
                                                                    <div className="w-full h-full max-w-4xl flex flex-col overflow-hidden">
                                                                        {/* Optional Header */}
                                                                        <DrawerHeader className="p-4 border-b">
                                                                            <DrawerTitle>Detailed Attendance {attendance.subjectName} ({attendance.subjectCode})</DrawerTitle>
                                                                            <DrawerDescription>Scroll to view all lectures</DrawerDescription>
                                                                        </DrawerHeader>

                                                                        {/* Scrollable Table */}
                                                                        <div className="flex-1 overflow-auto p-4">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead className="w-[50px]">Sno:</TableHead>
                                                                                        <TableHead>Lecture Date</TableHead>
                                                                                        <TableHead>Attendance Status</TableHead>
                                                                                        <TableHead>Marked By</TableHead>
                                                                                        <TableHead>Mark Date</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {myAttendance
                                                                                        .filter((att) => att.subjectId.subjectCode === attendance.subjectCode).sort((a, b) => new Date(b.date) - new Date(a.date))
                                                                                        .map((att, index) => (
                                                                                            <TableRow key={index}>
                                                                                                <TableHead>{index + 1}</TableHead>
                                                                                                <TableHead>{new Date(att.date).toLocaleDateString()}</TableHead>
                                                                                                <TableHead>{att.status}</TableHead>
                                                                                                <TableHead>{att.marked_by.name}</TableHead>
                                                                                                <TableHead>{new Date(att.createdAt).toLocaleDateString()}</TableHead>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>

                                                                        {/* Optional Footer */}
                                                                        <DrawerFooter className="border-t p-4">
                                                                            <DrawerClose>
                                                                                <Button variant="outline">Close</Button>
                                                                            </DrawerClose>
                                                                        </DrawerFooter>
                                                                    </div>
                                                                </DrawerContent>


                                                            </Drawer>
                                                        </span>
                                                        </TableHead>
                                                        <TableHead
                                                            className={calculateAttendancePercentage(attendance.attended, attendance.total) < 75 ? 'bg-red-400 text-white' : ''}
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
                <div className="block sm:hidden mt-2">
                    {filteredAttendance.map((attendance, index) => (
                        <div key={index} className="mb-4 border rounded-md shadow-sm">
                            <div className="p-4 flex justify-between items-center bg-gray-100 cursor-pointer" onClick={() => {
                                const panel = document.getElementById(`panel-${index}`)
                                panel.classList.toggle('hidden')
                            }}>
                                <div>
                                    <h3 className="font-semibold">{attendance.subjectName}</h3>
                                    <p className="text-sm text-gray-600">{attendance.subjectCode}</p>
                                </div>
                                <span className="text-sm font-medium">
                                    {calculateAttendancePercentage(attendance.attended, attendance.total)}%
                                </span>
                            </div>
                            <div id={`panel-${index}`} className="hidden p-4 bg-white text-sm">
                                <p><strong>Attended:</strong> {attendance.attended}</p>
                                <p><strong>Total Lectures:</strong> {attendance.total}</p>
                                <p><strong>Subject Code:</strong> {attendance.subjectCode}</p>
                                <p><strong>Attendance:</strong> {attendance.attended}/{attendance.total}</p>

                                <Drawer>
                                    <DrawerTrigger className="text-blue-600 mt-2 inline-block underline cursor-pointer">View Detailed Attendance</DrawerTrigger>
                                    <DrawerContent className="fixed inset-0 z-50 p-0 flex items-center justify-center">
                                        <div className="w-full h-full max-w-4xl flex flex-col overflow-hidden">
                                            <DrawerHeader className="p-4 border-b">
                                                <DrawerTitle>Detailed Attendance - {attendance.subjectName}</DrawerTitle>
                                                <DrawerDescription>Scroll to view all lectures</DrawerDescription>
                                            </DrawerHeader>
                                            <div className="flex-1 overflow-auto p-4">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[50px]">Sno:</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Marked By</TableHead>
                                                            <TableHead>Mark Date</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {myAttendance
                                                            .filter((att) => att.subjectId.subjectCode === attendance.subjectCode)
                                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                                            .map((att, i) => (
                                                                <TableRow key={i}>
                                                                    <TableHead>{i + 1}</TableHead>
                                                                    <TableHead>{new Date(att.date).toLocaleDateString()}</TableHead>
                                                                    <TableHead>{att.status}</TableHead>
                                                                    <TableHead>{att.marked_by.name}</TableHead>
                                                                    <TableHead>{new Date(att.createdAt).toLocaleDateString()}</TableHead>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <DrawerFooter className="border-t p-4">
                                                <DrawerClose asChild>
                                                    <Button variant="outline">Close</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>
                    ))}
                </div>
            </article>
        </main>
    )
}

export default StudentAttendance
