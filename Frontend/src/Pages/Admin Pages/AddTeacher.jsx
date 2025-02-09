import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../../Componenets/Loader'
import { useDispatch } from 'react-redux';
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice';
const apiUrl = import.meta.env.VITE_API_URL
const AddTeacher = ({ toggleState, onClick, title = "Teacher" }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const inputField = (label, type, placeholder, name) => {
        return (
            <div>
                <label className='text-sm'>{label}</label>
                <input required type={type} name={name} placeholder={placeholder} className='border-[#D4D4D4] border rounded-md w-full p-2 text-sm' />
            </div>
        )
    }
    const handlFormSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const teacherData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subjects: formData.get('subject'),
            [`${title.toLowerCase()}Id`]: formData.get(`${title.toLocaleLowerCase()}Id`).toUpperCase(),
            password: formData.get('password'),
            course: formData.get('course'),
            role: `${title.toLocaleLowerCase()}`
        };
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/admin/add${title}`, teacherData,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }))
        }
        catch (err) {
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }))
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <section className='w-full flex flex-col rounded-lg gap-2 bg-white p-5'>
                <nav className='flex justify-between items-center'>
                    <h1 className='text-xl font-medium'>Add New {title}</h1>
                    <i className="fa-solid fa-x cursor-pointer" onClick={() => onClick(!toggleState)}></i>
                </nav>
                <main>
                    <form className='flex flex-col gap-3 justify-center w-full h-full' onSubmit={handlFormSubmit}>
                        {inputField('Name', 'text', 'Enter Name', 'name')}
                        {inputField('Email', 'email', 'Enter Email', 'email')}
                        {inputField('Subject', 'text', 'Enter Subject(comma Seperated)', 'subject')}
                        {inputField(`${title} Id`, 'text', `Enter ${title} Id`, `${title.toLocaleLowerCase()}Id`)}
                        {inputField('Password', 'password', 'Enter Password', 'password')}
                        {inputField('Course', 'text', 'Enter Course', 'course')}
                        {loading ? <div className='flex justify-center items-center'>
                            <Loader />
                        </div> : <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Add {title}</button>}
                    </form>
                </main>
            </section>
        </>
    )
}

export default AddTeacher
