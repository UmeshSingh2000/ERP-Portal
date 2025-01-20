import axios from 'axios'
import React from 'react'
const apiUrl = import.meta.env.VITE_API_URL
const AddTeacher = ({toggleState,onClick}) => {
    const inputField = (label, type, placeholder,name) => {
        return (
            <div>
                <label className='text-sm'>{label}</label>
                <input required type={type} name={name} placeholder={placeholder} className='border-[#D4D4D4] border rounded-md w-full p-2 text-sm' />
            </div>
        )
    }
    const handlFormSubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData(e.target);
        const teacherData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subjects: formData.get('subject'),
            teacherId: formData.get('teacherId'),
            password: formData.get('password'),
            course: formData.get('course'),
            role : 'teacher'
        };
        try{
            const response = await axios.post(`${apiUrl}/admin/addTeacher`,teacherData,
                {
                    headers:{
                        authorization : `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            console.log(response)
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <>
            <section className='w-full flex flex-col gap-2 bg-white p-5 rounded-lg'>
                <nav className='flex justify-between items-center'>
                    <h1 className='text-xl font-medium'>Add New Teacher</h1>
                    <i className="fa-solid fa-x cursor-pointer" onClick={()=>onClick(!toggleState)}></i>
                </nav>
                <main>
                    <form className='flex flex-col gap-3 justify-center w-full h-full' onSubmit={handlFormSubmit}>
                        {inputField('Name','text','Enter Name','name')}
                        {inputField('Email','email','Enter Email','email')}
                        {inputField('Subject','text','Enter Subject','subject')}
                        {inputField('Teacher Id','text','Enter Teacher Id','teacherId')}
                        {inputField('Password','password','Enter Password','password')}
                        {inputField('Course','text','Enter Course','course')}
                        <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Add Teacher</button>
                    </form>
                </main>
            </section>
        </>
    )
}

export default AddTeacher
