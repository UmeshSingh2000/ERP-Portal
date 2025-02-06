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
      <main className='w-full h-dvh flex justify-center items-center'>
        <section className='w-4/5 p-2 md:w-auto md:p-2 md:h-auto xl:w-1/3 xl:py-6 lg:h-auto lg:w-2/5 2xl:w-2/4 2xl:h-2/4 h-[55%] flex flex-col justify-center items-center bg-white shadow-lg rounded-3xl gap-2 '>
          <header>
            <h1 className='text-2xl xl:text-3xl font-semibold'>Welcome Admin!</h1>
            <p className='text-base font-light'>Enter your credential to access your account </p>
          </header>
          <main className='w-full xl:w-9/12 flex flex-col items-center gap-2'>
            <div className='flex w-full relative'>
              <i className="fa-solid fa-envelope absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
              <input className='w-full border-[#8E8A8A] border rounded-md px-7 py-1' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='flex w-full relative'>
              <i className="fa-solid fa-lock absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
              <input className='w-full border-[#8E8A8A] border rounded-md px-7 py-1' type='password' placeholder='Password' onChange={(e) => setPass(e.target.value)} />
            </div>
            {loading ? <Loader /> : <Button onclick={handleLogin} />}
          </main>
          <footer className='w-full flex flex-col items-center cursor-pointer justify-between'>
            <p>Forget Password?</p>
            <Link to='/'><p>Are you User?</p></Link>
          </footer>
        </section>
      </main>
      <ToastContainer className="w-2/3 h-8" />
    </>
  )
}

export default AdminLogin
