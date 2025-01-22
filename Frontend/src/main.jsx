import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux' // redux provider
import {store} from './Redux/store'
import UserLogin from './Pages/UserLogin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StudentDashboard from './Pages/StudentDashboard'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import NotFoundPage from './Pages/NotFoundPage'
createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<UserLogin />} />
          <Route path="/" element={<UserLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </>
)
