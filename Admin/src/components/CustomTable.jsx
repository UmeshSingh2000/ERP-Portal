import React, { memo, useEffect, useRef, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { setData as courseData } from '@/ReduxStore/Features/Courses/courseSlice'
import { setData as subjectData } from '@/ReduxStore/Features/Subjects/subjectSlices'


import { Button } from './ui/button'
import Loader from './Loader/Loader'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import toastHelper from '@/Helpers/toastHelper'
import { useDispatch, useSelector } from 'react-redux'
const apiUrl = import.meta.env.VITE_API_URL;


const PAGE_SIZE = 10

const CustomTable = React.memo(({ data = [], currentPage, setCurrentPage, deleteTeacher, selectedTeacher, setSelectedTeacher, title = "Teacher" }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [editTeacherData, setEditTeacherData] = useState({})
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const [paginatedData, setPaginatedData] = useState([])
    const availableCourses = useSelector((state) => state.courses.value)
    const availableSubjects = useSelector((state) => state.subjects.value)


    const [fieldController, setFieldController] = useState({
        name: editTeacherData?.name,
        email: editTeacherData?.email,
        [`${title.toLowerCase()}Id`]: title.toLowerCase() === 'Teacher' ?
            editTeacherData.teacherId : editTeacherData.studentId,
        // teacherId: editTeacherData?.teacherId,
        course: editTeacherData?.course,
        subjects: editTeacherData?.subjects || []
    })

    const handleSelect = (e, teacherId) => {
        e.stopPropagation()
        if (selectedTeacher.includes(teacherId)) return setSelectedTeacher(selectedTeacher.filter((id) => id !== teacherId))
        setSelectedTeacher([...selectedTeacher, teacherId])
    }
    const isExist = (teacherId) => {
        return selectedTeacher.includes(teacherId)
    }
    const updateTeacher = async (e, teacherId) => {
        e.preventDefault()
        if (title === 'Teacher') fieldController.course = String(fieldController.course)
        fieldController.subjects = fieldController.subjects = String(fieldController.subjects)

        setLoading(true)
        try {
            const response = await axios.put(`${apiUrl}/admin/update${title}/${teacherId}`, fieldController, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toastHelper(toast, response.data.message, 'Success')
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error')
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
        setFieldController({
            ...editTeacherData,
        })
    }, [editTeacherData])


    useEffect(() => {
        setPaginatedData(data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
    }, [currentPage, data]);




    const InputFields = (label, type, name) => {
        return (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={name} className="text-right">
                        {label}
                    </Label>
                    <Input id={name} type={type} value={fieldController[name]} className="col-span-3" onChange={(e) => setFieldController({
                        ...fieldController, [name]: e.target.value
                    })} />
                </div>
            </div>
        )
    }



    // if (!data || data.length === 0) return <div className='h-screen w-full flex justify-center items-center'><Loader /></div>
    return (
        <>
            <div className="overflow-x-auto">
                {loading ? <div className='absolute top-1/2 left-1/2'><Loader /></div> :
                    <div className="w-full">
                        {/* Table for Larger Screens */}
                        <Table className="hidden sm:table">
                            <TableCaption>A list of your Enrolled {title}</TableCaption>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead className="w-[50px]">Sno:</TableHead>
                                    <TableHead className="w-[100px]">{title} ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-left">Subjects</TableHead>
                                    <TableHead className="text-left">Course</TableHead>
                                    <TableHead className="text-left">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((teacher, index) => (
                                    <Sheet key={teacher._id}>
                                        <SheetTrigger onClick={() => setEditTeacherData(teacher)} asChild>
                                            <TableRow className={`${isExist(teacher._id) ? 'shadow-md' : 'bg-transparent'} cursor-cell`}>
                                                <TableCell className="font-medium flex gap-0.5">
                                                    <Checkbox className="cursor-pointer h-4" onClick={(e) => handleSelect(e, teacher._id)} />
                                                    <p className='h-full'>{((currentPage - 1) * PAGE_SIZE) + index + 1}</p></TableCell>
                                                <TableCell className="font-medium">{title === 'Teacher' ? teacher.teacherId : teacher.studentId}</TableCell>
                                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                                <TableCell className="font-medium">{teacher.email}</TableCell>
                                                <TableCell className="font-medium">
                                                    <Select>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Subjects" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {teacher.subjects.map((subject, idx) => (
                                                                <SelectItem value={subject} key={idx}>{subject}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="font-medium">{title === 'Teacher' ? <Select>
                                                    <SelectTrigger className="w-[100px]">
                                                        <SelectValue placeholder="Course" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {teacher.course.map((itm, idx) => (
                                                            <SelectItem value={itm} key={idx}>{itm}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select> : teacher.course}</TableCell>
                                                <TableCell className="font-medium">
                                                    <Button size="sm" className="cursor-pointer" onClick={(e) => { deleteTeacher(teacher._id, teacher.name); e.stopPropagation(); }}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </SheetTrigger>
                                        <SheetContent className="w-[400px] sm:w-[540px]">
                                            <SheetHeader>
                                                <SheetTitle>Edit {title}</SheetTitle>
                                                <SheetDescription>Modify details for {teacher.name}</SheetDescription>
                                                <div className="grid py-4">
                                                    {InputFields('Name', 'text', 'name')}
                                                    {InputFields('Email', 'email', 'email')}
                                                    {InputFields(`${title === 'Teacher' ? 'TeacherId' : 'StudentId'}`, 'text', `${title === 'Teacher' ? 'teacherId' : 'studentId'}`)}
                                                    {title === 'Teacher' ?
                                                        <Select>
                                                            <SelectTrigger className="w-full mt-3">
                                                                <SelectValue placeholder="Select Course(s)" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableCourses.map((course) => (
                                                                    <div key={course._id} className="flex items-center gap-2 p-2">
                                                                        <Checkbox
                                                                            checked={Array.isArray(fieldController.course) && fieldController.course.includes(course.courseCode)}
                                                                            onCheckedChange={(checked) => {
                                                                                setFieldController((prev) => ({
                                                                                    ...prev,
                                                                                    course: checked
                                                                                        ? [...(Array.isArray(prev.course) ? prev.course : []), course.courseCode]
                                                                                        : prev.course.filter((c) => c !== course.courseCode),
                                                                                }));
                                                                            }}
                                                                        />
                                                                        <Label>{course.courseCode}</Label>
                                                                    </div>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        : <Select value={fieldController.course}
                                                            onValueChange={(value) => setFieldController({ ...fieldController, course: value })}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Course" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableCourses.map((course) => {
                                                                    return (
                                                                        <SelectItem key={course._id} value={course.courseCode}>{course.courseCode}</SelectItem>
                                                                    )
                                                                })}
                                                            </SelectContent>
                                                        </Select>}

                                                    <Select>
                                                        <SelectTrigger className="w-full mt-3">
                                                            <SelectValue placeholder="Select Subject(s)">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableSubjects.map((subject) => (
                                                                <div key={subject._id} className="flex items-center gap-2 p-2">
                                                                    <Checkbox
                                                                        checked={Array.isArray(fieldController.subjects) && fieldController.subjects.includes(subject.subjectName)}
                                                                        onCheckedChange={(checked) => {
                                                                            setFieldController((prev) => ({
                                                                                ...prev,
                                                                                subjects: checked
                                                                                    ? [...(Array.isArray(prev.subjects) ? prev.subjects : []), subject.subjectName]
                                                                                    : prev.subjects.filter((s) => s !== subject.subjectName),
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <Label>{subject.subjectName}</Label>
                                                                </div>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                </div>
                                                <SheetFooter>
                                                    <SheetClose asChild>
                                                        <Button type="submit" className="cursor-pointer" onClick={(e) => {
                                                            updateTeacher(e, teacher._id)
                                                        }}>Save changes</Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Mobile View - Stacked Cards */}
                        <div className="sm:hidden flex flex-col gap-4">
                            {paginatedData.map((teacher, index) => (
                                <Sheet key={teacher._id}>
                                    <SheetTrigger onClick={() => setEditTeacherData(teacher)} asChild>
                                        <div className="border rounded-lg p-4 shadow-md  cursor-pointer">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg">#{((currentPage - 1) * PAGE_SIZE) + index + 1}</h3>
                                                <Button size="sm" onClick={(e) => { deleteTeacher(teacher._id, teacher.name); e.stopPropagation(); }}>Delete</Button>
                                            </div>
                                            <p className="mt-2"><strong>{title} ID:</strong> {title === 'Teacher' ? teacher.teacherId : teacher.studentId}</p>
                                            <p><strong>Name:</strong> {teacher.name}</p>
                                            <p><strong>Email:</strong> {teacher.email}</p>
                                            <p><strong>Course:</strong> {title === 'Teacher' ? teacher.course.join(', ') : teacher.course}</p>
                                            <p><strong>Subjects:</strong> {teacher.subjects.join(', ')}</p>
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] sm:w-[540px]">
                                        <SheetHeader>
                                            <SheetTitle>Edit {title}</SheetTitle>
                                            <SheetDescription>Modify details for {teacher.name}</SheetDescription>
                                            <div className="grid py-4">
                                                {InputFields('Name', 'text', 'name')}
                                                {InputFields('Email', 'email', 'email')}
                                                {InputFields(`${title === 'Teacher' ? 'TeacherId' : 'StudentId'}`, 'text', `${title === 'Teacher' ? 'teacherId' : 'studentId'}`)}
                                                {/* {InputFields('Course', 'text', 'course')} */}
                                                {title === 'Teacher' ?
                                                    <Select>
                                                        <SelectTrigger className="w-full mt-3">
                                                            <SelectValue placeholder="Select Course(s)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableCourses.map((course) => (
                                                                <div key={course._id} className="flex items-center gap-2 p-2">
                                                                    <Checkbox
                                                                        checked={Array.isArray(fieldController.course) && fieldController.course.includes(course.courseCode)}
                                                                        onCheckedChange={(checked) => {
                                                                            setFieldController((prev) => ({
                                                                                ...prev,
                                                                                course: checked
                                                                                    ? [...(Array.isArray(prev.course) ? prev.course : []), course.courseCode]
                                                                                    : prev.course.filter((c) => c !== course.courseCode),
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <Label>{course.courseCode}</Label>
                                                                </div>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    : <Select value={fieldController.course}
                                                        onValueChange={(value) => setFieldController({ ...fieldController, course: value })}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Course" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableCourses.map((course) => {
                                                                return (
                                                                    <SelectItem key={course._id} value={course.courseCode}>{course.courseCode}</SelectItem>
                                                                )
                                                            })}
                                                        </SelectContent>
                                                    </Select>}
                                                {/* {InputFields('Subjects', 'text', 'subjects')} */}
                                                <Select>
                                                    <SelectTrigger className="w-full mt-3">
                                                        <SelectValue placeholder="Select Subject(s)">
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableSubjects.map((subject) => (
                                                            <div key={subject._id} className="flex items-center gap-2 p-2">
                                                                <Checkbox
                                                                    checked={Array.isArray(fieldController.subjects) && fieldController.subjects.includes(subject.subjectName)}
                                                                    onCheckedChange={(checked) => {
                                                                        setFieldController((prev) => ({
                                                                            ...prev,
                                                                            subjects: checked
                                                                                ? [...(Array.isArray(prev.subjects) ? prev.subjects : []), subject.subjectName]
                                                                                : prev.subjects.filter((s) => s !== subject.subjectName),
                                                                        }));
                                                                    }}
                                                                />
                                                                <Label>{subject.subjectName}</Label>
                                                            </div>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <SheetFooter>
                                                <SheetClose asChild>
                                                    <Button type="submit" className="cursor-pointer" onClick={(e) => {
                                                        updateTeacher(e, teacher._id)
                                                    }}>Save changes</Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            ))}
                        </div>
                    </div>
                }
                <Pagination className='flex justify-end w-auto z-10'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} `} onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    setLoading(true)
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 500)
                                }
                            }} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink>{currentPage} of {totalPages}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} `} onClick={() => {
                                if (currentPage < totalPages) {
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    setLoading(true)
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 500)
                                }
                            }} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
})

export default CustomTable
