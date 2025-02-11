import axios from 'axios'
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Loader from '../Componenets/Loader';
import Hamburger from '../Componenets/Hamburger';
const Students = lazy(() => import('./Admin Pages/Students'))
import logo from '../assets/Admin/manager.ico'
const Teacher = lazy(() => import('./Admin Pages/Teacher'))
const Home = lazy(() => import('./Admin Pages/Home'))
import { useSelector } from 'react-redux';
const Settings = lazy(() => import('./Admin Pages/Settings'))
const apiUrl = import.meta.env.VITE_API_URL
const AdminDashboard = () => {
    const data = useSelector((state) => state.toast.value)
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

    const [activePage, setActivePage] = useState('dashboard') //track active page

    const [menu, setMenu] = useState(false)


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
                    const localData = response.data.admin;
                    localStorage.setItem('admin', JSON.stringify(localData));
                    setAdmin(localData);
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
        SETTINGS: 'settings'
    }

    const handleActivePage = () => {
        switch (activePage) {
            case PAGES.DASHBOARD:
                return <Home />
            case PAGES.STUDENTS:
                return <Students />
            case PAGES.TEACHERS:
                return <Teacher />
            case PAGES.SETTINGS:
                return <Settings />
            default:
                return <Home />
        }
    }
    useEffect(() => {
        if (data) {
            toastHelper(data.type, data.message)
        }
        return () => { }
    }, [data])
    useEffect(() => {
        document.title = `Admin/${activePage.slice(0, 1).toUpperCase() + activePage.slice(1)}`
    }, [activePage])
    return (
        <>
            {loading && <div className='absolute top-1/2 left-1/2'><Loader /></div>}
            <main className={`${loading ? 'hidden' : 'flex'} h-screen w-screen`}>
                <aside className={`hamburger_menu ${menu ? 'left-0' : '-left-full'} bg-[#171717] absolute z-10 transition-all duration-300 h-screen w-1/2 md:w-1/4 xl:w-1/5`}>
                    <ul className='shadow-lg relative flex flex-col gap h-full'>
                        <li className='shadow-md h-20 flex items-center justify-center font-medium bg-[#03040] text-white'><img src={logo} alt="" className='w-10' />ERP</li>
                        <li className={`cursor-pointer ${activePage === 'dashboard' ? 'bg-[#2F2F2F]' : ''} rounded-2xl mr-2 ml-2 mt-2`} onClick={() => {
                            setActivePage('dashboard')
                            setMenu(false)
                        }}>🏠 Dashboard</li>
                        <li className={`cursor-pointer ${activePage === 'teachers' ? 'bg-[#2F2F2F] ' : ''} rounded-2xl mr-2 ml-2`} onClick={() => {
                            setActivePage('teachers')
                            setMenu(false)
                        }}>🧑‍🏫 Teachers</li>
                        <li className={`cursor-pointer ${activePage === 'students' ? 'bg-[#2F2F2F]' : ''} rounded-2xl mr-2 ml-2`} onClick={() => {
                            setActivePage('students')
                            setMenu(false)
                        }}>🎓 Students</li>
                        <li className={`cursor-pointer ${activePage === 'settings' ? 'bg-[#2F2F2F] ' : ''} rounded-2xl mr-2 ml-2`} onClick={() => {
                            setActivePage('settings')
                            setMenu(false)
                        }}>⚙️ Settings</li>
                        <li className='cursor-pointer absolute bottom-0' onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('admin')
                            navigate('/admin/login')
                        }}>🔓 <button>Logout</button></li>
                    </ul>
                </aside>
                <section className='w-full flex h-2/3 flex-col'>
                    <nav>
                        <div style={navBarStyle} className={`h-20 flex justify-between items-center shadow-md  p-4`}>
                            <Hamburger onClick={setMenu} />
                            <h1 className="text-white text-xl">Welcome {admin?.fullName.split(" ")[0]} 👋</h1>
                            <div className='cursor-pointer' onClick={() => setActivePage('settings')}>
                                {admin?.profile ? <img src={`${apiUrl}${admin.profile}`} alt="profile" className="w-10 h-10 rounded-full object-cover" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-10 h-10 rounded-full" />}
                            </div>
                        </div>
                    </nav>
                    <main className='w-full h-full p-4'>
                        {loading ? <Loader /> : <Suspense fallback={<div className='flex justify-center items-center h-full'><Loader /></div>}>{handleActivePage()}</Suspense>}
                    </main>
                </section>
            </main>
            <ToastContainer className="w-2/3 h-8 absolute z-10" />
        </>
    )
}
const navBarStyle = {
    // background: 'linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(22, 26, 33, 1) 20%, rgba(31, 41, 56, 1) 40%, rgba(36, 51, 74, 1) 60%, rgba(41, 61, 91, 1) 80%, rgba(32, 57, 93, 1) 100%)'
    background: '#212121'
}

export default AdminDashboard
