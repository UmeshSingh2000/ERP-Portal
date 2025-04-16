import React, { useCallback, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import CustomTable from '@/components/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '@/ReduxStore/Features/Teachers/teacherSlices';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from '@/hooks/use-toast';
import { Delete } from 'lucide-react';
import { setData as courseData } from '@/ReduxStore/Features/Courses/courseSlice'
import { setData as subjectData } from '@/ReduxStore/Features/Subjects/subjectSlices'
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
import { Label } from '@/components/ui/label';
import MultipleAddFromExcel from '@/components/MultipleAddFromExcel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const apiUrl = import.meta.env.VITE_API_URL;

const Teacher = () => {
    const { toast } = useToast()
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const teacherData = useSelector((state) => state.teachers.value);
    const [duplicateTeacherData, setDuplicateTeacherData] = useState(teacherData);
    const [selectedTeacher, setSelectedTeacher] = useState([])
    const [addTeacherData, setAddTeacherData] = useState({
        name: "",
        teacherId: "",
        email: "",
        password: "",
        course: [],
        subjects: []
    })
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const availableCourses = useSelector((state) => state.courses.value);
    const availableSubjects = useSelector((state) => state.subjects.value);

    const fetchData = useCallback(async () => {
        setSearch('')
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/admin/getTeachers`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(setData(response.data.teachers));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    /**
     * @function handleSearch
     * @param {object} e 
     * @returns set search value and filter teacher data default det to teacherData(full data) from db
     * @description This function search teacher by name and filter teacher data
     */
    const handleSearch = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setSearch(value);

        if (value === '') {
            setDuplicateTeacherData(teacherData);
        } else {
            const filteredData = teacherData.filter(({ name = "", email = "", teacherId = "", course = "" }) =>
                name.toLowerCase().includes(value) ||
                email.toLowerCase().includes(value) ||
                teacherId.toLowerCase().includes(value)
            );
            setDuplicateTeacherData(filteredData);
        }
        setCurrentPage(1);
    };


    /**
     * @function handleDelete
     * @param {string} teacherId 
     * @param {*string} name 
     * @description This function delete teacher by teacherId 
     */

    const handleDelete = async (teacherId, name) => {
        const confirm = window.confirm(`Are you sure you want to delete this teacher : ${name}?`)
        if (!confirm) return
        try {
            const response = await axios.delete(`${apiUrl}/admin/deleteTeacher/${teacherId}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                toastHelper(toast, response.data.message, 'success')
            }
        }
        catch (err) {
            // dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }))
            toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
        }
    }

    /**
     * @function handleDeleteMultiple
     * @description This function delete multiple teacher by teacherId require the id to be send as string seperated by comma which will be converted to array in the backend as db only accept array for multiple deletion
     */
    const handleDeleteMultiple = async () => {
        const confirm = window.confirm(`Are you sure you want to delete teachers?`)
        if (!confirm) return
        const teacherIds = selectedTeacher.join(',')
        try {
            const response = await axios.delete(`${apiUrl}/admin/delete-multipleTeacher/${teacherIds}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                toastHelper(toast, response.data.message, 'success')
                fetchData()
                setSelectedTeacher([])
            }
        } catch (err) {
            toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
        }
    }
    const InputFields = (label, type, name) => {
        return (
            <div className="w-full md:w-md">
                <div className="">
                    <Label htmlFor={name} className="text-right">
                        {label}
                    </Label>
                    <Input id={name} type={type} value={addTeacherData[name]} onChange={(e) => setAddTeacherData({ ...addTeacherData, [name]: e.target.value })} />
                </div>
            </div>
        )
    }

    /**
     * @function handlFormSubmit
     * @description Add new teacher
     */
    const handlFormSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/admin/addTeacher`, { ...addTeacherData, role: 'teacher' },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            toastHelper(toast, response.data.message, 'Success')
            setIsDrawerOpen(false)
            setAddTeacherData({
                name: "",
                teacherId: "",
                email: "",
                password: "",
                course: "",
                subjects: ""
            })
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }


    const getCourses = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/getCourses`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(courseData(response.data.courses))
        }
        catch (err) {
            console.log(err)
        }
    }
    const getSubjects = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/getSubjects`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(subjectData(response.data.subjects))
        }
        catch (err) {
            console.log(err)
        }
    }
    //get the courses and subjects
    useEffect(() => {
        if (availableCourses.length === 0) {
            getCourses()
        }
        if (availableSubjects.length === 0) {
            getSubjects()
        }
    }, [])





    useEffect(() => {
        setDuplicateTeacherData(teacherData);
    }, [teacherData]);

    useEffect(() => {
        if (teacherData.length > 0) return;
        fetchData();
    }, [teacherData.length, fetchData]);

    return (
        <main className="px-4 md:px-6 h-screen flex flex-col">
            {/* Header Section */}
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Teachers</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">Manage Teachers</p>

                {/* Search & Actions */}
                <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                    {/* Search and Refresh */}
                    <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
                        <Input
                            value={search}
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search..."
                            className="flex-1 min-w-[200px] md:w-52"
                        />

                        <Button className="cursor-pointer" onClick={fetchData}>Refresh</Button>
                        <Button onClick={handleDeleteMultiple} className={`${selectedTeacher.length > 1 ? 'block' : 'hidden'} cursor-pointer bg-red-500`}><Delete /></Button>
                    </div>

                    {/* Add Buttons */}
                    <div className="flex w-full md:w-auto items-center gap-2 justify-center md:justify-end flex-wrap">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <p className="bg-primary font-medium text-sm px-3 text-primary-foreground shadow hover:bg-primary/90 p-2 rounded-md cursor-pointer">Add Teacher</p>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle className="text-center text-3xl font-bold">Add Teacher</DrawerTitle>
                                    <DrawerDescription className="text-center text-sm">Enter details to add a new Teacher</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4 pb-0">
                                    <div className="flex flex-col items-center justify-center">
                                        {InputFields("Name", "text", "name")}
                                        {InputFields("TeacherId", "text", "teacherId")}
                                        {InputFields("Email", "email", "email")}
                                        {InputFields("Password", "password", "password")}
                                        <Select
                                            onValueChange={(value) => {
                                                setAddTeacherData((prev) => ({
                                                    ...prev,
                                                    course: prev.course.includes(value)
                                                        ? prev.course.filter((c) => c !== value)
                                                        : [...prev.course, value],
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="w-full md:w-md mt-2">
                                                <SelectValue placeholder='Course'>
                                                    {addTeacherData.course.length > 0
                                                        ? addTeacherData.course.join(", ")  // Show selected courses
                                                        : "Select Courses"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCourses.map((course) => (
                                                    <SelectItem key={course._id} value={course.courseCode}>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={addTeacherData.course.includes(course.courseCode)}
                                                                className="mr-2"
                                                                readOnly
                                                            />
                                                            {course.courseCode}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            onValueChange={(value) => {
                                                setAddTeacherData((prev) => ({
                                                    ...prev,
                                                    subjects: prev.subjects.includes(value)
                                                        ? prev.subjects.filter((subject) => subject !== value)
                                                        : [...prev.subjects, value],
                                                }));
                                            }}
                                        >
                                            <SelectTrigger className="w-full md:w-md mt-2">
                                                <SelectValue placeholder='Subjects'>
                                                    {addTeacherData.subjects.length > 0
                                                        ? addTeacherData.subjects.join(", ")  // Show selected subjects
                                                        : "Select Subjects"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSubjects.map((subject) => (
                                                    <SelectItem key={subject._id} value={subject.subjectName}>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={addTeacherData.subjects.includes(subject.subjectName)}
                                                                className="mr-2"
                                                                readOnly
                                                            />
                                                            {subject.subjectName}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                </div>
                                <DrawerFooter>
                                {loading ? <div className='m-auto'><Loader /></div>
                                    :<Button className="w-xs m-auto cursor-pointer" type="submit" onClick={handlFormSubmit}>Add</Button>}
                                    <DrawerClose>
                                        Cancel
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                        <MultipleAddFromExcel />
                        {/* <Button className="cursor-pointer bg-green-500">Add Multiple Teachers</Button> */}
                    </div>
                </div>
            </header>

            {/* Table Section */}
            <section className="overflow-x-auto overflow-y-auto flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader />
                    </div>
                ) : (
                    <CustomTable
                        data={duplicateTeacherData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        deleteTeacher={handleDelete}
                        selectedTeacher={selectedTeacher}
                        setSelectedTeacher={setSelectedTeacher}
                    />
                )}
            </section>
        </main>
    );
};

export default Teacher;
