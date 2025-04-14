import CoursewiseStudents from '@/components/CoursewiseStudents'
import SubjectWiseStudents from '@/components/SubjectWiseStudents';
import { setData } from '@/Redux/features/students(teachers)/courseWiseStudentsSlice';
import { setData as setSubjectWiseData } from '@/Redux/features/students(teachers)/subjectWiseStudentsSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
const apiUrl = import.meta.env.VITE_API_URL;


const TeacherHome = () => {
    const dispatch = useDispatch()
    const courseData = useSelector(state => state.teachersCourseWiseStudentNumber.value);
    const teacherCourse = JSON.parse(localStorage.getItem('teacher'))?.course
    const teacherSubjects = JSON.parse(localStorage.getItem('teacher'))?.subjects
    const getCourseWiseStudents = async () => {
        try {
            const response = await axios.post(`${apiUrl}/teacher/getCourseWiseStudent`, { course: teacherCourse, subjects: teacherSubjects }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // setData(response.data.courseWiseData)
            dispatch(setData(response.data.courseWiseData))
            dispatch(setSubjectWiseData(response.data.subjectWiseData))
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (courseData.length !== 0) return
        getCourseWiseStudents()
    }, [])
    return (
        <main>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">View,  Students profiles and their assigned classes.</p>
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                <CoursewiseStudents />
                <SubjectWiseStudents />
            </section>
        </main>
    )
}

export default TeacherHome
