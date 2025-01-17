import React, { useEffect, useState } from 'react'

const Hamburger = ({ onClick, state }) => {
    const [buttonState, setButtonState] = useState(true)
    useEffect(() => {
        if (window.innerWidth > 768) {
            setButtonState(false)
        } else {
            setButtonState(true)
        }

    }, [])
    return (
        <div className={`${buttonState ? 'block' : 'hidden'} cursor-pointer`} onClick={() => onClick(!state)}>
            <i className="fa-solid fa-bars text-2xl text-white"></i>
        </div>
    )
}

export default Hamburger
