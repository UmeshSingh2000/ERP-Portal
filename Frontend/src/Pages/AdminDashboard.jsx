import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import toastHelper from '../../Utils/toastHelper';
import Loader from '../Componenets/Loader';
const apiUrl = import.meta.env.VITE_API_URL
const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
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
                    await axios.post(`${apiUrl}/admin/dashboard`, {}, {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    })
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
                        toastHelper('error', err.response.data.message) // see this
                    }
                }

            }
            checkAdmin()
        }
        catch (error) {
            console(error.response);
        }
    }, [navigate])
    return (
        <>
            {loading && <div className='absolute top-1/2 left-1/2'><Loader /></div>}
            <div className={`${loading ? 'hidden' : 'block'}`}>
                welcome to admin dashboard
            </div>
            <ToastContainer className="w-2/3 h-8 absolute z-10" />
        </>
    )
}

export default AdminDashboard
