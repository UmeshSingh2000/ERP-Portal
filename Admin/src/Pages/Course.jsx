import CustomDialogue from '@/components/CustomDialogue'
import Loader from '@/components/Loader/Loader'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import toastHelper from '@/Helpers/toastHelper'
import { useToast } from '@/hooks/use-toast'
import { setData } from '@/ReduxStore/Features/Courses/courseSlice'

import axios from 'axios'
import { Delete } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
const apiUrl = import.meta.env.VITE_API_URL
const Course = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const courses = useSelector((state) => state.courses.value)
    const [filteredCourse, setFilteredCourse] = useState(courses)

    const fetchCourse = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/admin/getCourses`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(setData(response.data.courses))
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error')
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (courses.length !== 0) return
        fetchCourse()
    }, [courses, dispatch])


    return (
        <main className="px-4 md:px-6 flex flex-col">
            {/* Header Section */}
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Courses</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">Manage Course</p>
            </header>
            <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 ml-10 flex-wrap">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 min-w-[200px] md:w-52"

                    />
                    <Button className="cursor-pointer">Refresh</Button>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2 justify-center md:justify-end flex-wrap">
                    <CustomDialogue
                        desc="Create a new Course record-keeping."
                        title="Course"
                    />
                </div>
            </div>
            <div className="overflow-x-auto mt-5">
                {loading ? <div className='absolute top-1/2 left-1/2'><Loader /></div> :
                    <div className="w-full">
                        {/* Table for Larger Screens */}
                        <Table className="hidden sm:table">
                            <TableCaption>A list of Course</TableCaption>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead className="w-[50px]">Sno:</TableHead>
                                    <TableHead className="text-center">Course Code</TableHead>
                                    <TableHead className="text-center">Course Name</TableHead>
                                    <TableHead className="text-end">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourse.map((course, index) => (
                                    <Drawer key={course._id}>
                                        <DrawerTrigger asChild>
                                            <TableRow className="cursor-pointer">
                                                <TableHead>{index + 1}</TableHead>
                                                <TableHead className="text-center">{course.courseCode}</TableHead>
                                                <TableHead className="text-center">{course.courseName}</TableHead>
                                                <TableHead className='flex justify-end items-center mr-2'>
                                                    <Delete
                                                        className='cursor-pointer hover:scale-125 transition-all duration-200'

                                                    />
                                                </TableHead>
                                            </TableRow>
                                        </DrawerTrigger>
                                        <DrawerContent className="flex flex-col items-center">
                                            <DrawerHeader className="text-center">
                                                <DrawerTitle>Edit Course</DrawerTitle>
                                                <DrawerDescription>Modify the Course details below.</DrawerDescription>
                                            </DrawerHeader>

                                            <div className="w-full max-w-sm space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium">Course Code</label>
                                                    <Input

                                                        className="w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium">Subject Name</label>
                                                    <Input

                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>

                                            <DrawerFooter className="w-full flex flex-col items-center mt-4">
                                                <Button className="w-40 cursor-pointer">Save Changes</Button>
                                                <DrawerClose className='cursor-pointer'>
                                                    Cancel
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                }
            </div>
        </main>
    )
}

export default Course
