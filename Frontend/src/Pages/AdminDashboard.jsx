import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Loader from '../Componenets/Loader';
import Hamburger from '../Componenets/Hamburger';
import Students from './Admin Pages/Students';
import logo from '../assets/Admin/manager.ico'
import Teacher from './Admin Pages/Teacher';
import Home from './Admin Pages/Home';
import {  useSelector } from 'react-redux';
const apiUrl = import.meta.env.VITE_API_URL
const AdminDashboard = () => {
    const data = useSelector((state)=>state.toast.value)
    const navigate = useNavigate()
    //helper function to navigate to login page
    const navigationHelper = useCallback(() => {
        setTimeout(() => {
            setLoading(false)
            navigate('/admin/login');
        }, 2000)
    }, [navigate])

    const [loading, setLoading] = useState(false)
    const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin')) || null)

    const [activePage, setActivePage] = useState('Dashboard') //track active page

    const [menu, setMenu] = useState(false)
    // useEffect(() => {
    //     if (window.innerWidth > 768) {
    //         setMenu(true)
    //     } else {
    //         setMenu(false)
    //     }
    // }, [])

    useEffect(() => {
        if (admin) return;
        try {
            const checkAdmin = async () => {
                setLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    toastHelper('error', 'Unauthorized access: Token not found.')
                    return navigationHelper()
                }
                try {
                    const response = await axios.post(`${apiUrl}/admin/dashboard`, {}, {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    })
                    setAdmin(response.data.admin);
                    localStorage.setItem('admin', JSON.stringify(response.data.admin));
                    toastHelper('success', "Welcome to Dashboard")
                    setLoading(false)
                }
                catch (err) {
                    if (err.response && err.response.status === 403) {
                        toastHelper('error', 'Access denied: Admin privileges required.')
                        return navigationHelper()
                    }
                    else if (err.response && err.response.status === 401) {
                        toastHelper('error', 'Unauthorized access: Token invalid.')
                        return navigationHelper()
                    }
                    else {
                        toastHelper('error', err.response.data.message)
                        return navigationHelper()
                    }
                }
            }
            checkAdmin()
        }
        catch (error) {
            console.log(error.response);
        }
    }, [navigate, admin])

    const PAGES = {
        DASHBOARD: 'dashboard',
        STUDENTS: 'students',
        TEACHERS: 'teachers',
    }

    const handleActivePage = () => {
        switch (activePage) {
            case PAGES.DASHBOARD:
                return <Home />
            case PAGES.STUDENTS:
                return <Students />
            case PAGES.TEACHERS:
                return <Teacher />
            default:
                return <Home />
        }
    }
    useEffect(()=>{
        if(data){
            toastHelper(data.type, data.message)
        }
        return ()=>{}
    },[data])
    return (
        <>
            {loading && <div className='absolute top-1/2 left-1/2'><Loader /></div>}
            <main className={`${loading ? 'hidden' : 'flex'} w-screen`}>
                <aside className={`hamburger_menu ${menu ? 'left-0' : 'hidden'} transition-all duration-300 h-screen w-1/2 md:w-1/4 xl:w-1/5 relative`}>
                    <ul className='bg-white shadow-lg flex flex-col gap-5 h-full'>
                        <li className='h-20 flex items-center justify-center font-medium bg-gray-900 text-white'><img src={logo} alt="" className='w-10' />ERP </li>
                        <li className='cursor-pointer' onClick={() => setActivePage('dashboard')}>🏠 Dashboard</li>
                        <li className='cursor-pointer' onClick={() => setActivePage('teachers')}>🧑‍🏫 Teachers</li>
                        <li className='cursor-pointer' onClick={() => setActivePage('students')}>🎓 Students</li>
                        <li className='cursor-pointer'>⚙️ Settings</li>
                        <li className='cursor-pointer' onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('admin')
                            navigate('/admin/login')
                        }}>🔓 <button>Logout</button></li>
                    </ul>
                </aside>
                <section className='w-full'>
                    <nav>
                        <div className={`h-20 flex justify-between items-center shadow-md bg-gray-900 p-4`}>
                            <Hamburger onClick={setMenu} />
                            <h1 className="text-white text-xl">Welcome {admin?.name.split(" ")[0]} 👋</h1>
                            <div className='cursor-pointer'>
                                {admin?.profile ? <img src={admin.profile} alt="profile" className="w-10 h-10 rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-10 h-10 rounded-full" />}
                            </div>
                        </div>
                    </nav>
                    <main className='w-full h-auto p-4'>
                        {handleActivePage()}
                    </main>
                </section>
            </main>
            <ToastContainer className="w-2/3 h-8 absolute z-10" />
        </>
    )
}
export default AdminDashboard
