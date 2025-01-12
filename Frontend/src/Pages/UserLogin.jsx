import React, { useEffect, useState } from 'react'
import RolesBtn from '../Componenets/RolesBtn'
import InputField from '../Componenets/InputField'
import Button from '../Componenets/Button'
import { ToastContainer, toast } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Loader from '../Componenets/Loader';
const apiUrl = import.meta.env.VITE_API_URL;
const UserLogin = () => {
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState(null)
  const [id, setId] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  //role selection handler
  const handleRoleSelect = (role) => {
    setActiveRole((prevRole) => (prevRole === role ? null : role))
    toastHelper('success', `You have ${activeRole == role ? 'deselected' : 'selected'} ${role} role`)
  }

  //login button handler
  const handleLogin = async () => {
    //if user not selected any role return
    if (activeRole !== 'student' && activeRole != 'teacher') {
      return toastHelper('error', 'Please select a role')
    }

    //if user not filled any field return
    if (!id.trim() || !pass.trim()) {
      return toastHelper('error', 'Please fill all the fields')
    }
    //loading state set to true
    setLoading(true)
    try {
      //endpoints to api based on role
      const endpoint = `${apiUrl}/${activeRole}/login`

      //payload to send to api
      const payload = (activeRole === 'student') ? { studentId: id, password: pass } : { teacherId: id, password: pass }

      //sending request to api
      const response = await axios.post(endpoint, payload)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        toastHelper('success', response.data.message)
      }
      setTimeout(() => {
        navigate(`/${activeRole}/dashboard`)
      }, 5000);
    }
    catch (err) {
      toastHelper('error', err.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <>
      <main style={pageStyle} className='w-full h-dvh flex justify-center items-center'>
        <section className='w-3/4 md:w-auto md:p-2 md:h-auto xl:w-1/3 lg:h-4/6 lg:w-2/5 lg:py-2 2xl:w-2/4 2xl:h-2/4 h-96 flex flex-col justify-center items-center bg-white shadow-lg rounded-3xl p-3 gap-2'>
          <header>
            <h1 className='text-2xl xl:text-4xl font-semibold'>Welcome Back</h1>
            <p className='text-sm xl:text-xl'>Enter your credential to access your account </p>
          </header>
          <nav className='w-full'>
            <div className="xl:w-9/12 roles m-auto flex gap-2 justify-center">
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
          <main className='w-full xl:w-9/12 flex flex-col items-center gap-2'>
            <InputField type="id" value={id} onChange={setId} />
            <InputField type="pass" value={pass} onChange={setPass} />
            {loading ? <Loader /> : <Button onclick={handleLogin} />}
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
const pageStyle = {
  backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'
}
export default UserLogin
