import React from 'react'

const InputField = ({type,value,onChange}) => {
    return (
        <>
            <input className='w-full border-[#8E8A8A] border rounded-md px-2 py-1' type={type==='id'?'text':'password'} placeholder={type==='id'?'StudentId':'Password'} onChange={(e)=>onChange(e.target.value)} value = {value}/>
        </>
    )
}

export default InputField
