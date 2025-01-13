import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
  return (
    <>
      <main className='w-full h-dvh flex justify-center items-center'>
        <section className='w-4/5 p-2 md:w-auto md:p-2 md:h-auto xl:w-1/3 xl:py-6 lg:h-auto lg:w-2/5 2xl:w-2/4 2xl:h-2/4 h-[55%] flex flex-col justify-center items-center bg-white shadow-lg rounded-3xl gap-2 '>
          <header>
            <h1 className='text-2xl xl:text-3xl font-semibold'>Welcome Admin!</h1>
            <p className='text-base font-light'>Enter your credential to access your account </p>
          </header>
          <main className='w-full xl:w-9/12 flex flex-col items-center gap-2'>
            <input className='w-full border-[#8E8A8A] border rounded-md px-2 py-1' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            <input className='w-full border-[#8E8A8A] border rounded-md px-2 py-1' type='password' placeholder='Password' onChange={(e)=> setPass(e.target.value)}/>
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
