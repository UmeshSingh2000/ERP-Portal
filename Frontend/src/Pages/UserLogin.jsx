import React, { useEffect, useState } from 'react'
import RolesBtn from '../Componenets/RolesBtn'
import InputField from '../Componenets/InputField'
import Button from '../Componenets/Button'
import { ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
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
        navigate(`/${activeRole}/dashboard`)
      }
    }
    catch (err) {
      toastHelper('error', err.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }
  //handle enter button
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') handleLogin()
    }

    document.addEventListener('keydown', handleEnter)
    return () => document.removeEventListener('keydown', handleEnter)
  }, [handleLogin])
  useEffect(() => {
    document.title = 'User Login';
    setLoading(true)
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [])
  if (loading) {
    return <div className='flex items-center justify-center h-screen'><Loader /></div>
  }
  return (
    <>
      <main className='w-full h-dvh flex justify-center items-center'>
        <section className='p-3 w-4/5 h-2/3 flex items-center flex-col justify-center gap-3 md:w-1/3 xl:h-auto 2xl:w-3/5 2xl:gap-5'>
          <header>
            <h1 className='text-4xl font-bold 2xl:text-5xl xl:text-center'>Welcome Back</h1>
            <p className='text-sm font-normal 2xl:text-2xl xl:text-center'>Enter your credential to access your account </p>
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
            <InputField type="id" value={id} onChange={setId} role={activeRole} />
            <InputField type="pass" value={pass} onChange={setPass} role={activeRole} />
            {loading ? <Loader /> : <Button onclick={handleLogin} />}
          </main>
          <footer className='w-full flex flex-col items-center cursor-pointer justify-between'>
            <p className='xl:text-base 2xl:text-2xl'>Forget Password?</p>
            <Link to='/admin/login'><p className='xl:text-base 2xl:text-2xl'>Are you Admin?</p></Link>
          </footer>
        </section>
      </main>
      <ToastContainer className="w-2/3 h-8" />
    </>
  )
}
export default UserLogin
