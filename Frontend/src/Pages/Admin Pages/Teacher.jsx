import React, { useState } from 'react'
import AddTeacher from './AddTeacher'

const Teacher = () => {
    const [addTeacherToggle, setAddTeacherToggle] = useState(false)
    
    return (
        <>
            <nav>
                <header className='flex justify-between items-center p-2'>
                    <h1 className='font-bold'>Teachers</h1>
                    <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm' onClick={()=>setAddTeacherToggle(!addTeacherToggle)}>Add Teacher</button>
                </header>
                <footer className='w-full md:w-1/2'>
                    <div className='relative w-full'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                        <div className='flex items-center gap-2'>
                            <input type="text" placeholder='Search Teacher' className='border-[#D4D4D4] border rounded-md w-full p-2 px-7 text-sm' />
                            <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Search</button>
                        </div>
                    </div>
                </footer>
            </nav>
            {addTeacherToggle && <div className='absolute w-4/5 h-1/2 overflow-auto md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <AddTeacher toggleState = {addTeacherToggle} onClick={setAddTeacherToggle}/>
            </div>}
        </>
    )
}

export default Teacher
