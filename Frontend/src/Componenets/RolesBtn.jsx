import React, { useState } from 'react'
import stud from '../assets/UserLogin/student-reading.webp'
import teach from '../assets/UserLogin/teacher.webp'
const RolesBtn = ({ role,isActive,onSelect }) => {
    return (
        <>
            <button className={`${isActive ? 'bg-[#BEF3FF]':'bg-transparent'} p-3 w-full flex flex-col justify-center items-center rounded-md border-[#8E8A8A] border`} onClick={onSelect}>
                <img loading="lazy" className='w-1/3 object-cover' src={role==='student'?stud:teach} />
                {role === 'student' ? <p className='text-center text-lg font-semibold'>Student</p> : <p className='text-center text-lg font-semibold'>Teacher</p>}
            </button>
            
        </>
    )
}

export default RolesBtn
