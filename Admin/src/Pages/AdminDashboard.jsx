import React, { lazy, Suspense, useCallback, useEffect } from 'react'
import { useState } from "react";
import axios from 'axios';
import { Menu, X, LayoutDashboard, GraduationCap, Settings, Users, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../assets/logo.ico'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader/Loader';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from "@/hooks/use-toast"
// import Teacher from './Teacher';
const Teacher = lazy(() => import('./Teacher'));
// import Home from './Home';
const Home = lazy(() => import('./Home'));
import Students from './Students';
import AdminSettings from './AdminSettings';
import ThemeToggle from '@/components/ThemeToggle';
import { useSelector } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_URL;
const AdminDashboard = () => {
    const theme = useSelector((state)=>state.theme.value)
    const { toast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin')) || null)
    const [isOpen, setIsOpen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard') //track active page
    const navigationHelper = useCallback(() => {
        setLoading(false)
        navigate('/');
    }, [navigate])
    useEffect(() => {
        if (admin) return;
        const checkAdmin = async () => {
            setLoading(true)
            const token = localStorage.getItem('token')
            try {
                const response = await axios.post(`${apiUrl}/admin/dashboard`, {}, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const localData = response.data.admin;
                localStorage.setItem('admin', JSON.stringify(localData));
                setAdmin(localData);
                toastHelper(toast, "Welcome to Dashboard", 'Success', 2000)
                setLoading(false)
            }
            catch (err) {
                if (err.response && err.response.status === 403) {

                    toastHelper(toast, 'Access denied: Admin privileges required.', 'Error', 2000, "destructive")
                    return navigationHelper()
                }
                else if (err.response && err.response.status === 401) {

                    // toastHelper('error', 'Unauthorized access: Token invalid.')
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
        checkAdmin()
    }, [navigate, admin])
    useEffect(() => {
        document.title = `Admin/${activePage.slice(0, 1).toUpperCase() + activePage.slice(1)}`
    }, [activePage])


    //custom class for sidebar item
    const customClass = (type) => {
        return `${activePage === `${type}` ? 'bg-[#2F2F2F] text-white' : ''} text-gray-700 block sidebar-item`
    }


    //handling page selection to ui
    const PAGES = {
        DASHBOARD: 'dashboard',
        STUDENTS: 'students',
        TEACHERS: 'teachers',
        SETTINGS: 'settings'
    }

    const handleActivePage = () => {
        switch (activePage) {
            case PAGES.DASHBOARD:
                return <Home />
            case PAGES.STUDENTS:
                return <Students />
            case PAGES.TEACHERS:
                return <Teacher />
            case PAGES.SETTINGS:
                return <AdminSettings />
            default:
                return <Home />
        }
    }


    if (loading) return <div className='absolute top-1/2 left-1/2'><Loader /></div>
    return (
        <>
            <div className="fixed top-2 right-2 z-30 rounded-lg">
                <ThemeToggle />
            </div>
            <div className="flex">
                {/* Sidebar (Always Visible on Large Screens) */}
                <div className="hidden md:flex md:flex-col w-64 h-screen shadow-md border p-5 fixed left-0 top-0">
                    <div className='flex items-center justify-center mb-6'>
                        <img src={logo} alt="logo" className='w-8' />
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    <ul className="space-y-4">
                        <li><a href="#" className={customClass('dashboard')} onClick={() => {
                            setActivePage('dashboard')
                        }}> <LayoutDashboard className="w-5 h-5" />Dashboard</a></li>
                        <li><a href="#" className={customClass('teachers')} onClick={() => {
                            setActivePage('teachers')
                        }}><GraduationCap className="w-5 h-5" />Teacher</a></li>
                        <li><a href="#" className={customClass('students')} onClick={() => {
                            setActivePage('students')
                        }}><Users className="w-5 h-5" />Students</a></li>
                        <li><a href="#" className={customClass('settings')} onClick={() => {
                            setActivePage('settings')
                        }}><Settings className="w-5 h-5" />Settings</a></li>
                        {/* <li>
                            <HoverCard>
                                <HoverCardTrigger><ThemeToggle /></HoverCardTrigger>
                                <HoverCardContent>
                                    Toggle Theme
                                </HoverCardContent>
                            </HoverCard>
                        </li> */}
                        <li className='pl-5 pt-1 font-semibold mb-2 gap-2.5 absolute bottom-0 left-0 w-full flex items-center'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{admin ? admin.fullName : ''}</p>
                                <p className='text-sm'>{admin ? admin.email.slice(0, 5).concat('....').concat(admin.email.slice(-9)) : ""}</p>
                            </div>
                            <LogOut className='cursor-pointer' onClick={() => {
                                localStorage.removeItem('token')
                                localStorage.removeItem('admin')
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
                            <a href="#" className="text-xl font-bold mx-auto">Admin Dashboard</a>
                        </div>
                    </nav>

                    {/* Mobile Menu (Slide from Left) */}
                    <AnimatePresence>
                        {isOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    className={`fixed inset-0 ${theme==='dark' ? 'bg-black' : 'bg-white'}    z-20`}
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
                                    className={`fixed top-0 left-0 h-full w-64 ${theme==='dark' ? 'bg-black' : 'bg-white'} shadow-md z-20 p-5`}
                                >
                                    <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
                                        <X className="w-6 h-6 cursor-pointer" />
                                    </button>
                                    <div className='flex items-center justify-center mb-6 mt-8'>
                                        <img src={logo} alt="logo" className='w-8' />
                                        <h1 className="text-xl font-bold text-black">Admin Dashboard</h1>
                                    </div>
                                    <ul className="mt-10 space-y-4">
                                        <li><a href="#" className={customClass("dashboard")} onClick={() => {
                                            setActivePage('dashboard')
                                        }}> <LayoutDashboard className="w-5 h-5" />Dashboard</a></li>
                                        <li><a href="#" className={customClass('teachers')} onClick={() => {
                                            setActivePage('teachers')
                                        }}><GraduationCap className="w-5 h-5" />Teacher</a></li>
                                        <li><a href="#" className={customClass('students')} onClick={() => {
                                            setActivePage('students')
                                        }}><Users className="w-5 h-5" />Students</a></li>
                                        <li><a href="#" className={customClass('settings')} onClick={() => {
                                            setActivePage('settings')
                                        }}><Settings className="w-5 h-5" />Settings</a></li>
                                        <li className='pl-5 pt-1 font-semibold mb-2 absolute bottom-0 left-0 w-full'>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{admin ? admin.fullName : ''}</p>
                                                <p className='text-sm'>{admin ? admin.email.slice(0, 5).concat('....').concat(admin.email.slice(-9)) : ""}</p>
                                            </div>
                                            <LogOut className='cursor-pointer' onClick={() => {
                                                localStorage.removeItem('token')
                                                localStorage.removeItem('admin')
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
                        {loading ? <Loader /> : <Suspense fallback={<div className='flex justify-center items-center h-screen'><Loader /></div>}>{handleActivePage()}</Suspense>}
                    </div>
                </div>
            </div >
        </>
    )
}

export default AdminDashboard
