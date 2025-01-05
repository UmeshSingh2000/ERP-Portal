import React, { useEffect, useState } from 'react'
import RolesBtn from '../Componenets/RolesBtn'
import InputField from '../Componenets/InputField'
import Button from '../Componenets/Button'
import { ToastContainer, toast } from 'react-toastify';


const UserLogin = () => {
  const [activeRole, setActiveRole] = useState(null)
  const handleRoleSelect = (role) => {
    setActiveRole((prevRole) => (prevRole === role ? null : role))
    toast.success(`You have ${activeRole==role?'deselected':'selected'} ${role} role`,{
      position: "top-right",
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  return (
    <>
      <main className='w-full h-dvh flex justify-center items-center bg-[#f7d2a7]'>
        <section className='w-3/4 md:w-auto md:p-2 md:h-2/4 xl:w-auto lg:h-auto 2xl:w-2/4 2xl:h-2/4 h-96 flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-3 gap-2'>
          <header>
            <h1 className='text-2xl font-semibold'>Welcome Back</h1>
            <p className='text-sm'>Enter your credential to access your account </p>
          </header>
          <nav className='w-full'>
            <div className="xl:w-2/3 roles m-auto flex gap-2 justify-center">
              <RolesBtn
                role="student"
                isActive={activeRole === 'student'}
                onSelect={() => handleRoleSelect('student')}
              />
              <RolesBtn role="teacher"
                isActive={activeRole === 'teacher'}
                onSelect={() => handleRoleSelect('teacher')}
              />
            </div>
          </nav>
          <main className='w-full xl:w-2/3 flex flex-col gap-2'>
            <InputField type="id" />
            <InputField type="pass" />
            <Button />
          </main>
          <footer className='w-full flex flex-col items-center cursor-pointer justify-between'>
            <p>Forget Password?</p>
            <p>Are you Admin?</p>
          </footer>
        </section>
      </main>
      <ToastContainer className="w-2/3 h-8" />
    </>
  )
}
export default UserLogin
