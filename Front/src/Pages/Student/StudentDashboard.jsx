import Dashboard from '@/components/Dashboard';
import ThemeToggle from '@/components/ThemeToggle';
import Loader from '@/components/ui/Loader';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL

const StudentDashboard = () => {
    const { toast } = useToast()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [student, setStudent] = useState(() => JSON.parse(localStorage.getItem('student')) || null)
    const navigationHelper = useCallback(() => {
        setLoading(false)
        navigate('/');
    }, [navigate])

    useLayoutEffect(() => {
        if (student) return;
        const checkStudent = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(`${apiUrl}/student/dashboard`, {}, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const localData = response.data;
                localStorage.setItem('student', JSON.stringify(localData));
                setStudent(localData)
                toastHelper(toast, "Welcome to Dashboard", 'Success', 2000)
                setLoading(false)

            } catch (error) {
                if (error.response && error.response.status === 403) {
                    toastHelper(toast, 'Access denied: Student privileges required.', 'Error', 2000, "destructive")
                    return navigationHelper()
                }
                else if (error.response && error.response.status === 401) {
                    toastHelper(toast, 'Unauthorized access: Token invalid.', 'Error', 2000, "destructive")
                    return navigationHelper()
                }
                else {
                    toastHelper(toast, error.response.data.message, 'Error', 2000, "destructive")
                    return navigationHelper()
                }
            }
            finally {
                setLoading(false)
            }
        }
        checkStudent()
    }, [navigate, student])
    return (
        <>
            {
                loading ? <Loader /> :
                    <>
                        <div className="fixed top-2 right-2 z-30 rounded-lg">
                            <ThemeToggle />
                        </div>
                        <Dashboard title="Student" />
                    </>
            }
        </>
    )
}

export default StudentDashboard
