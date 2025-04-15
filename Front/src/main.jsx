import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLogin from './Pages/UserLogin'
import { Toaster } from "@/components/ui/toaster"
import TeacherDashboard from './Pages/Teacher/TeacherDashboard'
import { store } from './Redux/store'
import { Provider } from 'react-redux'
import StudentDashboard from './Pages/Student/StudentDashboard'

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path='/teacher/dashboard' element={<TeacherDashboard />} />
          <Route path='/student/dashboard' element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  </>
)
