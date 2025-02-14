import React from 'react'

const Button = ({onclick}) => {
  return (
    <>
        <button className={`border-[#8E8A8A] p-2 border rounded-full w-28 h-12 2xl:w-36 2xl:h-14 2xl:text-2xl text-sm m-auto}`} onClick={onclick}>Login</button>
    </>
  )
}

export default Button
