import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLogin from './Pages/UserLogin'
import { Toaster } from "@/components/ui/toaster"
import TeacherDashboard from './Pages/TeacherDashboard'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path='/teacher/dashboard' element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </>
)
