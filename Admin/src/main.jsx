import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import AdminLogin from './Pages/AdminLogin'
import { Toaster } from "@/components/ui/toaster"
import NotFoundPage from './Pages/NotFoundPage'
import AdminDashboard from './Pages/AdminDashboard'
// import Navbar from './components/Navbar'

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </>
)
