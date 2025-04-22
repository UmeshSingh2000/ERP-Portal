import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from 'axios'
import Calander from '@/components/Calander'
import toastHelper from '@/Helpers/toastHelper'
import { useToast } from '@/hooks/use-toast'
import Loader from '@/components/ui/Loader'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDispatch, useSelector } from 'react-redux'
import { setData } from '@/Redux/features/Leaves/leavesSlice'

const apiUrl = import.meta.env.VITE_API_URL

const StudentLeave = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const leaves = useSelector((state) => state.leaves.value)
    // const [leaves, setLeaves] = useState([])
    const [date, setDate] = useState(new Date())
    const [leaveType, setLeaveType] = useState("")
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    const student = JSON.parse(localStorage.getItem('student')) || null

    const applyLeave = async () => {
        if (!date || !leaveType || !reason) {
            toastHelper(toast, "Please fill in all fields before submitting.", "Error")
            return
        }

        if (!student || !student.id || !student.course) {
            alert("Student info missing. Please login again.")
            toastHelper(toast, "Student info missing. Please login again.", "Error")
            return
        }

        try {
            setLoading(true)
            const { course, id } = student
            const response = await axios.post(`${apiUrl}/student/applyLeave`, {
                course,
                studentId: id,
                leaveDate: date.toISOString(),
                leaveType,
                reason
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toastHelper(toast, response.data.message, "Success")
            setDate(new Date())
            setLeaveType("")
            setReason("")
        }
        catch (err) {
            console.error(err)
            toastHelper(toast, err.response?.data?.message || "Something went wrong.", "Error")
        }
        finally {
            setLoading(false)
        }
    }

    const getMyLeaves = async () => {
        try {
            setLoading(true)
            const { id } = student
            const response = await axios.get(`${apiUrl}/student/getMyLeave/${id}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setData(response.data.leaves))
            toastHelper(toast, response.data.message, "Success")
        }
        catch (err) {
            console.error(err)
            toastHelper(toast, err.response?.data?.message || "Something went wrong.", "Error")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (leaves.length > 0) return
        if (student) {
            getMyLeaves()
        }
    }, [])

    return (
        <main>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Student Leave</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                    Your Leave requests will be shown here. You can also check the status of your leave requests.
                </p>
            </header>

            {/* Centered Drawer Button */}
            <div className="flex justify-center items-center mt-4">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className="cursor-pointer">Create Leave Request</Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Leave Request</DrawerTitle>
                            <DrawerDescription>Fill out the form below to request a leave.</DrawerDescription>
                        </DrawerHeader>

                        <div className="px-4 py-2 flex flex-col gap-4">
                            {/* Date Picker */}
                            <Calander date={date} setDate={setDate} />

                            {/* Leave Type */}
                            <div>
                                <label className="block mb-1 font-medium">Leave Type</label>
                                <Select value={leaveType} onValueChange={setLeaveType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sick">Sick</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="vacation">Vacation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block mb-1 font-medium">Reason</label>
                                <Textarea
                                    placeholder="Write your reason here..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <DrawerFooter>
                            <Button disabled={loading} onClick={applyLeave}>
                                {loading ? "Applying..." : "Apply"}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            {loading ? <Loader /> :
                <Table className="hidden sm:table">
                    <TableCaption>Your Leave Requests</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sno:</TableHead>
                            <TableHead>Leave Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied On</TableHead>
                            <TableHead>Approved By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaves.length > 0 ? leaves.map((leave, index) => (
                            <TableRow key={index}>
                                <TableHead>{index + 1}</TableHead>
                                <TableHead>{new Date(leave.leaveDate).toLocaleDateString()}</TableHead>
                                <TableHead>{leave.reason}</TableHead>
                                <TableHead className={
                                    leave.status === 'Approved' ? 'text-green-600' :
                                        leave.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                                }>
                                    {leave.status}
                                </TableHead>
                                <TableHead>{new Date(leave.createdAt).toLocaleDateString()}</TableHead>
                                <TableHead>{leave?.approvedBy?.name || 'Pending'}</TableHead>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableHead colSpan={6} className="text-center text-gray-500">
                                    No leave data available.
                                </TableHead>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            }
            {/* Mobile responsive version */}
            <div className="block sm:hidden px-4 mt-6 space-y-4">
                {leaves.length > 0 ? leaves.map((leave, index) => (
                    <div
                        key={index}
                        className="border rounded-xl shadow-sm p-4 space-y-2 bg-white"
                    >
                        <div className="flex justify-between">
                            <span className="font-semibold">Sno:</span>
                            <span>{index + 1}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Leave Date:</span>
                            <span>{new Date(leave.leaveDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="font-semibold block">Reason:</span>
                            <p className="text-gray-700">{leave.reason}</p>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Status:</span>
                            <span className={
                                leave.status === 'approved' ? 'text-green-600 font-medium' :
                                    leave.status === 'rejected' ? 'text-red-500 font-medium' : 'text-yellow-500 font-medium'
                            }>
                                {leave.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Applied On:</span>
                            <span>{new Date(leave.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Approved By:</span>
                            <span>{leave?.approvedBy?.name || 'Pending'}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-500">No leave data available.</div>
                )}
            </div>

        </main>
    )
}

export default StudentLeave
