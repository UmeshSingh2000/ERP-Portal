import { createRoot } from 'react-dom/client'
import './index.css'
import UserLogin from './Pages/UserLogin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentDashboard from './Pages/StudentDashboard'
import AdminLogin from './Pages/AdminLogin'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserLogin/>} />
      <Route path="/student/dashboard" element={<StudentDashboard/>} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={<AdminLogin/>} />
    </Routes>
  </BrowserRouter>
)
