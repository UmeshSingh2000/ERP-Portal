import React from 'react'

const InputField = ({type}) => {
    return (
        <>
            <input className='w-full border-[#8E8A8A] border rounded-md px-2 py-1' type={type==='id'?'text':'password'} placeholder={type==='id'?'StudentId':'Password'}/>
        </>
    )
}

export default InputField
