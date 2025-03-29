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
    const [search, setSearch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState({ courseCode: "", courseName: "" });



    const fetchCourse = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/admin/getCourses`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFilteredCourse(response.data.courses)
            dispatch(setData(response.data.courses))
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error')
        }
        finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = confirm('Do you want to delete this Course')
        if (confirmDelete) {
            setLoading(true)
            try {
                const response = await axios.delete(`${apiUrl}/admin/deleteCourse/${id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                toastHelper(toast, response.data.message, 'Success')
            }
            catch (err) {
                toastHelper(toast, err.response.data.message, 'Error')
            }
            finally {
                setLoading(false)
            }
        }

    }
    const handleUpdate = async (id) => {
        try {
            if (!selectedCourse.courseCode && !selectedCourse.courseName) {
                toastHelper(toast, "Please fill in all fields", "Error");
                return;
            }

            setLoading(true);
            const response = await axios.put(
                `${apiUrl}/admin/updateCourse/${id}`,
                selectedCourse,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toastHelper(toast, response.data.message, "Success");
            fetchCourse(); // Refresh the subjects list
        } catch (err) {
            toastHelper(toast, err.response?.data?.message || "Update failed", "Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!search) {
            setFilteredCourse(courses);
        } else {
            const filtered = courses.filter(course =>
                course.courseName.toLowerCase().includes(search.toLowerCase()) ||
                course.courseCode.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredCourse(filtered);
        }
    }, [search, courses]);

    useEffect(() => {
        if (courses.length !== 0) return
        fetchCourse()
    }, [])

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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button className="cursor-pointer" onClick={fetchCourse}>Refresh</Button>
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
                                            <TableRow onClick={() => setSelectedCourse({ courseCode: course.courseCode, courseName: course.courseName })} className="cursor-pointer">
                                                <TableHead>{index + 1}</TableHead>
                                                <TableHead className="text-center">{course.courseCode}</TableHead>
                                                <TableHead className="text-center">{course.courseName}</TableHead>
                                                <TableHead className='flex justify-end items-center mr-2'>
                                                    <Delete
                                                        className='cursor-pointer hover:scale-125 transition-all duration-200'
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete(course._id)
                                                        }}
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
                                                        value={selectedCourse.courseCode}
                                                        onChange={(e) => setSelectedCourse({ ...selectedCourse, courseCode: e.target.value.toUpperCase() })}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium">Subject Name</label>
                                                    <Input
                                                        value={selectedCourse.courseName}
                                                        onChange={(e) => setSelectedCourse({ ...selectedCourse, courseName: e.target.value.toUpperCase() })}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>

                                            <DrawerFooter className="w-full flex flex-col items-center mt-4">
                                                <Button className="w-40 cursor-pointer" onClick={() => handleUpdate(course._id)}>Save Changes</Button>
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
            <div className="sm:hidden flex flex-col gap-4">
                {filteredCourse.map((course, index) => (
                    <Drawer key={course._id}>
                        <DrawerTrigger asChild>
                            <div className="border rounded-lg p-4 shadow-md cursor-pointer" onClick={() => setSelectedCourse(course)}>
                                <p className="font-semibold">#{index + 1}</p>
                                <p><strong>Subject Code:</strong> {course.courseCode}</p>
                                <p><strong>Subject Name:</strong> {course.courseName}</p>
                                <div className="flex justify-end mt-2">
                                    <Delete className='cursor-pointer text-red-500' onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(course._id)
                                    }} />
                                </div>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Edit Course</DrawerTitle>
                                <DrawerDescription>Modify the details.</DrawerDescription>
                            </DrawerHeader>
                            <div className='flex flex-col gap-2'>
                                <div>
                                    <label className="block text-sm font-medium">Course Code</label>
                                    <Input value={selectedCourse.courseCode} onChange={(e) => setSelectedCourse({ ...selectedCourse, courseCode: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Course Code</label>
                                    <Input value={selectedCourse.courseName} onChange={(e) => setSelectedCourse({ ...selectedCourse, courseName: e.target.value })} />
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button className="cursor-pointer" onClick={() => handleUpdate(course._id)}>Save</Button>
                                <DrawerClose className='cursor-pointer'>Cancel</DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ))}
            </div>
        </main>
    )
}

export default Course
