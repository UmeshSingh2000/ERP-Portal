import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Loader from '../Componenets/Loader';
import Hamburger from '../Componenets/Hamburger';
const apiUrl = import.meta.env.VITE_API_URL
const AdminDashboard = () => {
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
    
    const [menu, setMenu] = useState(false)

    useEffect(() => {
        if (window.innerWidth > 768) {
            setMenu(true)
        } else {
            setMenu(false)
        }
    }, [])

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
    return (
        <>
            {loading && <div className='absolute top-1/2 left-1/2'><Loader /></div>}
            <main className={`${loading ? 'hidden' : 'block'}`}>
                <nav className=''>
                    <div className={`flex justify-between items-center bg-gray-800 p-4`}>
                        <Hamburger onClick={setMenu} state={menu} />
                        <h1 className="text-white text-xl">Welcome {admin?.name.split(" ")[0]} 👋</h1>
                        <div className='cursor-pointer'>
                            {admin?.profile ? <img src={admin.profile} alt="profile" className="w-10 h-10 rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-10 h-10 rounded-full" />}
                        </div>
                    </div>
                </nav>
                <aside className={`${menu ? 'left-0' : '-left-full'} transition-all duration-300 h-screen w-1/2 relative`}>
                    <ul className='bg-gray-200 flex flex-col gap-5 h-full pt-4 pl-4'>
                        <li className='cursor-pointer'>🏠 Dashboard</li>
                        <li className='cursor-pointer'>🧑‍🏫 Teachers</li>
                        <li className='cursor-pointer'>🎓 Students</li>
                        <li className='cursor-pointer'>⚙️ Settings</li>
                        <li className='cursor-pointer'>🔓 <button onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('admin')
                            navigate('/admin/login')
                        }} className="bg-red-500 text-white px-2 py-1 rounded">Logout</button></li>
                    </ul>

                </aside>
            </main>
            <ToastContainer className="w-2/3 h-8 absolute z-10" />
        </>
    )
}

export default AdminDashboard
