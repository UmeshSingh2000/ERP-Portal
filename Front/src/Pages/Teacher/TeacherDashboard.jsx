import Dashboard from '@/components/Dashboard'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(() => JSON.parse(localStorage.getItem('teacher')) || null)
  const [loading, setLoading] = useState(false)
  useLayoutEffect(() => {
    if (teacher) return;
    const checkTeacher = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      try {
        const response = await axios.post(`${apiUrl}/admin/dashboard`, {}, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        // const localData = response.data.admin;
        // localStorage.setItem('admin', JSON.stringify(localData));
        // setAdmin(localData);
        // toastHelper(toast, "Welcome to Dashboard", 'Success', 2000)
        // setLoading(false)
      }
      catch (err) {
        if (err.response && err.response.status === 403) {

          // toastHelper(toast, 'Access denied: Admin privileges required.', 'Error', 2000, "destructive")
          // return navigationHelper()
        }
        else if (err.response && err.response.status === 401) {
          // toastHelper(toast, 'Unauthorized access: Token invalid.', 'Error', 2000, "destructive")

          // return navigationHelper()
        }
        else {
          // toastHelper(toast, err.response.data.message, 'Error', 2000, "destructive")
          // return navigationHelper()
        }
      }
      finally {
        setLoading(false)
      }
    }
    checkTeacher()
  }, [navigate, teacher])
  return (
    <>
      <Dashboard title="Teacher" />
    </>
  )
}

export default TeacherDashboard
