import React, { useState } from 'react'
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

const StudentLeave = () => {
    const [date, setDate] = useState()
    const [leaveType, setLeaveType] = useState("")
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    const student = JSON.parse(localStorage.getItem('student')) || null

    const applyLeave = async () => {
        if (!date || !leaveType || !reason) {
            alert("Please fill in all fields before submitting.")
            return
        }

        if (!student || !student.id || !student.course) {
            alert("Student info missing. Please login again.")
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

            alert(response.data.message || "Leave request submitted!")
            setDate(null)
            setLeaveType("")
            setReason("")
        }
        catch (err) {
            console.error(err)
            alert(err.response?.data?.message || "Something went wrong.")
        }
        finally {
            setLoading(false)
        }
    }

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
                            <div className="flex-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

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
        </main>
    )
}

export default StudentLeave
