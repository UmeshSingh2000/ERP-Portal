import React from 'react'

const InputField = ({type,value,onChange,role}) => {
    const placeholder = type==='id' ? (role===null ? 'ID' : (role==='student' ? 'StudentId' : 'TeacherId')) : 'Password'
    return (
        <>
            <input className='w-full border-[#8E8A8A] border rounded-md px-2 py-1' type={type==='id'?'text':'password'} placeholder={placeholder} onChange={(e)=>onChange(e.target.value.toUpperCase())} value = {value}/>
        </>
    )
}

export default InputField
