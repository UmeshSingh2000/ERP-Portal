import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Button from '../Componenets/Button'
import Loader from '../Componenets/Loader';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    //if user not filled any field return
    if (!email.trim() || !pass.trim()) {
      return toastHelper('error', 'Please fill all the fields')
    }
    //loading state set to true
    setLoading(true)
    try {
      //endpoints to api based on role
      const endpoint = `${apiUrl}/admin/login`

      //payload to send to api
      const payload = { email, password: pass }

      //sending request to api
      const response = await axios.post(endpoint, payload)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        toastHelper('success', response.data.message)
        navigate(`/admin/dashboard`)
      }
    }
    catch (err) {
      console.log(err);
      toastHelper('error', err.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') handleLogin()
    }
    document.addEventListener('keydown', handleEnter)
    return () => document.removeEventListener('keydown', handleEnter)
  }, [handleLogin])
  useEffect(() => {
    document.title = 'Admin Login';
    setLoading(true)
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500)
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).role : null
    const checkTokenValidation = async () => {
      try {
        const header = token;
        const endPoint = `${apiUrl}/verify-token`
        const response = await axios.post(endPoint, {}, {
          headers: {
            authorization: `Bearer ${header}`
          }
        })
        if (response.status === 200) {
          toastHelper('success', 'Automatic redirecting...')
          setTimeout(() => {
            navigate('/admin/dashboard')
          }, 2000)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    if (token && role === 'admin') {
      checkTokenValidation()
    }
    return () => clearTimeout(timeout)
  }, [])
  if (loading) {
    return <div className='flex items-center justify-center h-screen'><Loader /></div>
  }
  return (
    <>
      <main  className='w-full h-dvh flex justify-center items-center'>
        <section className='p-3 w-4/5 h-2/3 flex items-center flex-col justify-center gap-3 md:w-1/3 2xl:w-3/5 2xl:gap-5'>
          <header>
            <h1 className='text-4xl font-bold 2xl:text-5xl xl:text-center'>Welcome Admin!</h1>
            <p className='text-sm font-normal 2xl:text-2xl xl:text-center'>Enter your credential to access your account </p>
          </header>
          <main className='w-full 2xl:w-3/5 flex flex-col items-center gap-3 2xl:gap-5'>
            <div className='flex w-full gap-1 flex-col relative'>
              <label htmlFor="email" className='text-sm'>Email:</label>
              <div className='relative w-full'>
                <i className="text-black fa-solid fa-envelope absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                <input id='email' className='w-full text-black h-10 border-[#8E8A8A] border rounded-md px-7 py-1 2xl:h-14 2xl:text-2xl' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="password" className='text-sm'>Password:</label>
              <div className='w-full relative'>
                <i className="text-black fa-solid fa-lock absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                <input id='password' className='w-full h-10 text-black border-[#8E8A8A] border rounded-md px-7 py-1 2xl:h-14 2xl:text-2xl' type='password' placeholder='Password' onChange={(e) => setPass(e.target.value)} />
              </div>
            </div>
            {loading ? <Loader /> : <Button onclick={handleLogin} />}
          </main>
          <footer className='w-full flex flex-col items-center cursor-pointer justify-between'>
            <p className='xl:text-base 2xl:text-2xl'>Forget Password?</p>
            <Link to='/'><p className='xl:text-base 2xl:text-2xl'>Are you User?</p></Link>
          </footer>
        </section>
      </main>
      <ToastContainer className="w-2/3 h-8" />
    </>
  )
}

export default AdminLogin
