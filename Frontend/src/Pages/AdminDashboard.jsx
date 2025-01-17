import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Loader from '../Componenets/Loader';
const apiUrl = import.meta.env.VITE_API_URL
const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin')) || null)
    const navigate = useNavigate()
    useEffect(() => {
        if (admin) return;
        try {
            const checkAdmin = async () => {
                setLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    toastHelper('error', 'Unauthorized access: Token not found.')
                    return setTimeout(() => {
                        setLoading(false)
                        navigate('/admin/login');
                    }, 2000)
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
                        setTimeout(() => {
                            setLoading(false)
                            navigate('/admin/login');
                        }, 2000);
                    }
                    else if (err.response && err.response.status === 401) {
                        toastHelper('error', 'Unauthorized access: Token invalid.')
                        setTimeout(() => {
                            setLoading(false)
                            navigate('/admin/login');
                        }, 2000);
                    }
                    else {
                        toastHelper('error', err.response.data.message)
                        setTimeout(() => {
                            setLoading(false)
                            navigate('/admin/login');
                        }, 2000);
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
                <nav>
                    <div className="flex justify-between items-center bg-gray-800 p-4">
                        <h1 className="text-white text-2xl">Welcome {admin?.name} 👋</h1>
                        <div className='cursor-pointer'>
                            {admin?.profile ? <img src={admin.profile} alt="profile" className="w-10 h-10 rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-10 h-10 rounded-full" />}
                        </div>
                    </div>
                </nav>
                <aside>
                    <ul>
                        <li>🏠 Dashboard</li>
                        <li>🧑‍🏫 Teachers</li>
                        <li>🎓 Students</li>
                        <li>⚙️ Settings</li>
                        <li>🔓 <button onClick={() => {
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
