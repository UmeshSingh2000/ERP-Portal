import Dashboard from '@/components/Dashboard'
import ThemeToggle from '@/components/ThemeToggle'
import Loader from '@/components/ui/Loader'
import toastHelper from '@/Helpers/toastHelper'
import { useToast } from '@/hooks/use-toast'
import { setData } from '@/Redux/features/TeachersData/teacherCourseSlice'
import { setData as teacherSubject } from '@/Redux/features/TeachersData/teacherSubjectSlice'
import axios from 'axios'
import { LogOut } from 'lucide-react'
import React, { useCallback, useLayoutEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL

const TeacherDashboard = () => {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [teacher, setTeacher] = useState(() => JSON.parse(localStorage.getItem('teacher')) || null)
  const [loading, setLoading] = useState(false)
  const navigationHelper = useCallback(() => {
    setLoading(false)
    navigate('/');
  }, [navigate])

  useLayoutEffect(() => {
    if (teacher) return;
    const checkTeacher = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      try {
        const response = await axios.post(`${apiUrl}/teacher/dashboard`, {}, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        const localData = response.data;
        localStorage.setItem('teacher', JSON.stringify(localData));
        setTeacher(localData);
        dispatch(setData(localData.course))
        dispatch(teacherSubject(localData.subjects))
        toastHelper(toast, "Welcome to Dashboard", 'Success', 2000)
        setLoading(false)
      }
      catch (err) {
        if (err.response && err.response.status === 403) {
          toastHelper(toast, 'Access denied: Teacher privileges required.', 'Error', 2000, "destructive")
          return navigationHelper()
        }
        else if (err.response && err.response.status === 401) {
          toastHelper(toast, 'Unauthorized access: Token invalid.', 'Error', 2000, "destructive")
          return navigationHelper()
        }
        else {
          toastHelper(toast, err.response.data.message, 'Error', 2000, "destructive")
          return navigationHelper()
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
      {
        loading ? <Loader /> :
          <>
            <div className="fixed top-2 right-2 z-30 rounded-lg">
              <ThemeToggle />
            </div>
            <Dashboard title="Teacher" />
          </>
      }
    </>
  )
}

export default TeacherDashboard
