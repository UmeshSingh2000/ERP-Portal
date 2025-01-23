import React, { useEffect, useState } from 'react'

const Hamburger = ({ onClick }) => {
    // const [buttonState, setButtonState] = useState(true)
    // useEffect(() => {
    //     if (window.innerWidth > 768) {
    //         setButtonState(false)
    //     } else {
    //         setButtonState(true)
    //     }
    // }, [])
    return (
        <div className={`block cursor-pointer`} onClick={() => onClick(prev=>!prev)}>
            <i className="fa-solid fa-bars text-2xl text-white"></i>
        </div>
    )
}

export default Hamburger
