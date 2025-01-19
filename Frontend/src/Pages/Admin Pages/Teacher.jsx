import React from 'react'

const Teacher = () => {
    return (
        <>
            <nav>
                <header className='flex justify-between items-center p-2'>
                    <h1 className='font-bold'>Teachers</h1>
                    <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Add Teacher</button>
                </header>
                <footer className='w-full'>
                    <div className='relative w-2/5'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                        <div className='flex items-center gap-2'>
                            <input type="text" placeholder='Search Teacher' className='border-[#D4D4D4] border rounded-md w-full p-2 px-7 text-sm' />
                            <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm'>Search</button>
                        </div>

                    </div>
                </footer>
            </nav>
        </>
    )
}

export default Teacher
