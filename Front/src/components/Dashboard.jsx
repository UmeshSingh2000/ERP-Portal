import React, { useEffect, useLayoutEffect, useState } from 'react'
import logo from "@/assets/logo.ico"
import { GraduationCap, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import TeacherSettings from '@/Pages/Teacher/TeacherSettings';
import Home from './Home';
import { useNavigate } from 'react-router-dom';
import TeacherStudent from '@/Pages/Teacher/TeacherStudent';
import TeacherAttendance from '@/Pages/Teacher/TeacherAttendance';
const apiUrl = import.meta.env.VITE_API_URL

const Dashboard = ({ title }) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [activePage, setActivePage] = useState('Dashboard')
    const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem(title.toLowerCase())) || null);

    const customClass = (type) => {
        return `${activePage === `${type}` ? 'bg-[#2F2F2F] text-white' : ''} block sidebar-item flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#777676] hover:text-white font-semibold`
    }
    const PAGES = {
        DASHBOARD: 'Dashboard',
        ATTENDANCE: 'Attendance',
        STUDENTS: 'Students',
        ATTENDANCE: 'Attendance',
        SETTINGS: 'Settings'
    }
    const handleActivePage = () => {
        switch (activePage) {
            case PAGES.DASHBOARD:
                return <Home title="Teacher" />
            case PAGES.STUDENTS:
                return <TeacherStudent />
            case PAGES.ATTENDANCE:
                return <TeacherAttendance />
            case PAGES.SETTINGS:
                return title === 'Teacher' ? <TeacherSettings /> : "student"
            default:
                return <Home title="Teacher" />
        }
    }
    useEffect(() => {
        document.title = `${title}/${activePage.slice(0, 1).toUpperCase() + activePage.slice(1)}`
    }, [activePage])
    return (
        <div className="flex">
            {/* Sidebar (Always Visible on Large Screens) */}
            <div className="hidden md:flex md:flex-col w-64 h-screen shadow-md border p-5 fixed left-0 top-0">
                <div className='flex items-center justify-center mb-6'>
                    <img src={logo} alt="logo" className='w-8' />
                    <h1 className="text-xl font-bold">{title} Dashboard</h1>
                </div>
                <ul className="space-y-4 teacher_dashboard">
                    <li className={customClass('Dashboard')} onClick={() => setActivePage('Dashboard')}><LayoutDashboard className="w-5 h-5" />Dashboard</li>
                    <li className={customClass('Students')} onClick={() => setActivePage('Students')}><Users className="w-5 h-5" />Students</li>
                    <li className={customClass('Attendance')} onClick={() => setActivePage('Attendance')}><GraduationCap className="w-5 h-5" />Attendance</li>
                    <li className={customClass('Settings')} onClick={() => setActivePage('Settings')}><Settings className="w-5 h-5" />Settings</li>
                    <li className='pl-5 pt-1 font-semibold mb-2 gap-2.5 absolute bottom-0 left-0 w-full flex items-center'>
                        <Avatar>
                            <AvatarImage className="object-cover" src={userData?.profile ? `${apiUrl}${userData.profile}` : "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{userData ? userData.name : ''}</p>
                            <p className='text-sm'>{userData ? userData.email.slice(0, 5).concat('....').concat(userData.email.slice(-9)) : ""}</p>
                        </div>
                        <LogOut className='cursor-pointer' onClick={() => {
                            localStorage.clear()
                            navigate('/')
                        }} />
                    </li>
                </ul>

            </div>

            {/* Content Wrapper (Shifts Content Right on Large Screens) */}
            <div className="flex-1 md:ml-64">
                <nav className=" border-b shadow-md md:hidden">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        {/* Left Side: Mobile Menu Button */}
                        <button onClick={() => setIsOpen(true)} className="md:hidden">
                            <Menu className="w-6 h-6 cursor-pointer" />
                        </button>

                        {/* Center: Logo */}
                        <a href="#" className="text-xl font-bold mx-auto">{title} Dashboard</a>
                    </div>
                </nav>

                {/* Mobile Menu (Slide from Left) */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className={`fixed inset-0 bg-white z-20`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Sidebar Menu for Mobile */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.3 }}
                                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-20 p-5`}
                            >
                                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
                                    <X className="w-6 h-6 cursor-pointer" />
                                </button>
                                <div className='flex items-center justify-center mb-6 mt-8'>
                                    <img src={logo} alt="logo" className='w-8' />
                                    <h1 className="text-xl font-bold text-black">{title} Dashboard</h1>
                                </div>
                                <ul className="mt-10 space-y-4 teacher_dashboard">
                                    <li className={customClass('Dashboard')} onClick={() => setActivePage('Dashboard')}><LayoutDashboard className="w-5 h-5" />Dashboard</li>
                                    <li className={customClass('Students')} onClick={() => setActivePage('Students')}><GraduationCap className="w-5 h-5" />Students</li>
                                    <li className={customClass('Attendance')} onClick={() => setActivePage('Attendance')}><Users className="w-5 h-5" />Attendance</li>
                                    <li className={customClass('Settings')} onClick={() => setActivePage('Settings')}><Settings className="w-5 h-5" />Settings</li>
                                    <li className='pl-5 pt-1 font-semibold mb-2 absolute bottom-0 left-0 w-full'>
                                        <Avatar>
                                            <AvatarImage className="object-cover" src={userData?.profile ? `${apiUrl}${userData.profile}` : "https://github.com/shadcn.png"} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p>{userData ? userData.name : ""}</p>
                                            <p className='text-sm'>{userData ? userData.email.slice(0, 5).concat('....').concat(userData.email.slice(-9)) : ""}</p>
                                        </div>
                                        <LogOut className='cursor-pointer' onClick={() => {
                                            localStorage.clear()
                                            navigate('/')
                                        }} />
                                    </li>
                                </ul>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                {/* Page Content */}
                <div className="py-5">
                    {handleActivePage()}
                </div>
            </div>
        </div >
    )
}

export default Dashboard
