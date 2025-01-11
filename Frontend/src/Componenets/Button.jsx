import React from 'react'

const Button = ({onclick}) => {
  return (
    <>
        <button className='border-[#8E8A8A] p-2 border rounded-full w-24 text-sm m-auto' onClick={onclick}>Login</button>
    </>
  )
}

export default Button
