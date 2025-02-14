import React from 'react'

const InputField = ({ type, value, onChange, role }) => {
    const placeholder = type === 'id' ? (role === null ? 'ID' : (role === 'student' ? 'StudentId' : 'TeacherId')) : 'Password'
    return (
        <>
            <div className='w-full'>
                <label htmlFor="" className='text-base 2xl:text-xl'>{type.toUpperCase()}:</label>
                <div className='flex w-full relative'>
                    <i className={`fa-solid fa-${type === 'id' ? 'envelope' : 'lock'} absolute top-1/2 -translate-y-1/2 left-[2%]`}></i>
                    <input className='w-full h-10 text-black border-[#8E8A8A] border rounded-md px-6 py-1 2xl:h-14 2xl:text-2xl 2xl:px-10' type={type === 'id' ? 'text' : 'password'} placeholder={placeholder} onChange={(e) => onChange(e.target.value.toUpperCase())} value={value} />
                </div>
            </div>
        </>
    )
}

export default InputField
