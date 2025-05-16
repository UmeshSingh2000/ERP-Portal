import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '@/components/ui/Loader'
import toastHelper from '@/Helpers/toastHelper'
import { useToast } from '@/hooks/use-toast'
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table'
import { BookCheck, CircleX } from 'lucide-react'

const apiUrl = import.meta.env.VITE_API_URL

const TeacherLeave = () => {
    const { toast } = useToast()
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(false)

    const getLeaves = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/teacher/getCoordinatorLeaves`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setLeaves(response.data.leaves)
            toastHelper(toast, "Leave data fetched successfully", "Success")
        } catch (err) {
            console.error(err)
            toastHelper(toast, err.response?.data?.message || "Something went wrong", "Error")
        } finally {
            setLoading(false)
        }
    }



    const handleLeaveAction = async (leaveId, status) => {
        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/teacher/leaveAction`, {
                leaveId,
                status
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toastHelper(toast, response.data.message, "Success")
            getLeaves()
        } catch (err) {
            console.error(err)
            toastHelper(toast, err.response?.data?.message || "Something went wrong", "Error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getLeaves()
    }, [])



    return (
        <main>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Student Leave Requests</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                    Review and manage leave requests submitted by students from your assigned courses.
                </p>
            </header>

            {loading ? <Loader /> : (
                <Table className="w-full">
                    <TableCaption>Student Leave Requests</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sno</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Leave Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied On</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaves.length > 0 ? (
                            leaves.map((leave, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{leave?.studentId?.name || "N/A"}</TableCell>
                                    <TableCell>{leave?.studentId?.course}</TableCell>
                                    <TableCell>{new Date(leave?.leaveDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{leave?.leaveType}</TableCell>
                                    <TableCell>{leave?.reason}</TableCell>
                                    <TableCell className={
                                        leave?.status === "approved"
                                            ? "text-green-600"
                                            : leave.status === "rejected"
                                                ? "text-red-500"
                                                : "text-yellow-500"
                                    }>
                                        {leave?.status}
                                    </TableCell>
                                    <TableCell>{new Date(leave?.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className='flex gap-2'><BookCheck onClick={() => handleLeaveAction(leave?._id, "approved")} className='text-green-500 cursor-pointer' /><CircleX onClick={() => handleLeaveAction(leave._id, "rejected")} className='text-red-600 cursor-pointer' /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-gray-500">
                                    No leave requests available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </main>
    )
}

export default TeacherLeave
