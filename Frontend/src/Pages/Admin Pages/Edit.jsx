import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice'
import Loader from '../../Componenets/Loader'
const apiUrl = import.meta.env.VITE_API_URL
const Edit = ({ toggleState, onClick, teacherData }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [fieldController, setFieldController] = useState({
        name: teacherData.name,
        email: teacherData.email,
        subject: teacherData.subjects,
        teacherId: teacherData.teacherId,
        course: teacherData.course
    })
    const inputField = (label, type, placeholder, name) => {
        return (
            <div>
                <label className='text-sm'>{label}</label>
                <input required type={type} name={name} value={fieldController[name]} placeholder={placeholder} className='border-[#D4D4D4] border rounded-md w-full p-2 text-sm' onChange={(e) => setFieldController({ ...fieldController, [name]: e.target.value })} />
            </div>
        )
    }
    const updateTeacher = async (e) => {
        e.preventDefault()
        const updatedTeacherData = new FormData(e.target)
        const payload = {
            name: updatedTeacherData.get('name'),
            email: updatedTeacherData.get('email'),
            subjects: updatedTeacherData.get('subject'),
            teacherId: updatedTeacherData.get('teacherId'),
            course: updatedTeacherData.get('course')
        }
        setLoading(true)
        try {
            const response = await axios.put(`${apiUrl}/admin/updateTeacher/${teacherData._id}`, payload, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }))
            onClick(false)
        }
        catch (err) {
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }))
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <section className='w-full flex flex-col gap-2 bg-white p-5 rounded-lg'>
                <nav className='flex justify-between items-center'>
                    <h1 className='text-xl font-medium'>Edit teacher</h1>
                    <i className="fa-solid fa-x cursor-pointer" onClick={() => onClick(false)}></i>
                </nav>
                <main>
                    <form className='flex flex-col gap-3 justify-center w-full h-full' onSubmit={updateTeacher}>
                        {inputField('Name', 'text', 'Enter Name', 'name')}
                        {inputField('Email', 'email', 'Enter Email', 'email')}
                        {inputField('Subject', 'text', 'Enter Subject(comma Seperated)', 'subject', teacherData.subjects)}
                        {inputField('Teacher Id', 'text', 'Enter Teacher Id', 'teacherId')}
                        {/* {inputField('Password', 'password', 'Enter Password', 'password')} */}
                        {inputField('Course', 'text', 'Enter Course', 'course')}
                        {loading ? <div className='flex justify-center items-center'><Loader /></div> : <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Update Teacher</button>}

                    </form>
                </main>
            </section>
        </>
    )
}

export default Edit
