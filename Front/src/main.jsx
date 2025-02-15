import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLogin from './Pages/UserLogin'
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
        {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
        {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      </Routes>
    </BrowserRouter>
    <Toaster/>
  </>
)
