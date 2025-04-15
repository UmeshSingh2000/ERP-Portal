import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { SendHorizontal } from 'lucide-react'
import toastHelper from '@/Helpers/toastHelper'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
const apiUrl = import.meta.env.VITE_API_URL

const Settings = ({ title }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef()
    const [passwordVerified, setPasswordVerified] = useState(false)
    const [teacher, setTeacher] = useState(() => title === 'Teacher' ? JSON.parse(localStorage.getItem('teacher')) : JSON.parse(localStorage.getItem('student'))) //details stored in local storage
    const [userDetails, setUserDetails] = useState({
        name: teacher?.name,
        email: teacher?.email,
        [`${title.toLowerCase()}Id`]: title === 'Teacher' ? teacher?.teacherId : teacher?.studentId,
        currPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })




    const InputFields = (label, type, name) => {
        return (
            <div className="w-full relative">
                <Label htmlFor={name} className="text-right">
                    {label}:
                </Label>
                <Input disabled={name === 'teacherId' || name === 'studentId'} onChange={(e) => setUserDetails({ ...userDetails, [name]: e.target.value })} id={name} value={userDetails[name]} type={type} className="w-full" />
                {name === 'currPassword' && <SendHorizontal className='absolute top-1/2 right-3 w-4 cursor-pointer hover:w-6 transition-all' onClick={() => verifyPassword(userDetails['currPassword'])} />}
            </div>
        )
    }
    const handleUpdateProfile = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        await uploadImage(file)
    }
    const uploadImage = async (file) => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('image', file)
            const response = await axios.put(`${apiUrl}/${title.toLowerCase()}/updateProfile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toastHelper(toast, response.data.message, 'Success')
            setTimeout(() => toastHelper(toast, "Refresh to Update", 'Success', 2000), 500)
        }
        catch (error) {
            toastHelper(toast, error.response.data.message, 'Error', 1000, "destructive")
        }
        finally {
            setLoading(false)
        }
    }


    /**
   * @description Verify Password
   * @param {string} password - The password to verify 
   */
    const verifyPassword = async (password) => {
        if (!password) return toastHelper(toast, "Please provide password", 'Error', 1000, "destructive")
        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/${title.toLowerCase()}/verifyPassword`, { password }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                toastHelper(toast, response.data.message, 'Success')
                setPasswordVerified(true)
            }
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
        }
        finally {
            setLoading(false)
            userDetails['currPassword'] = ""
        }
    }

    const handleTeacherUpdate = async () => {
        try {
            setLoading(true)
            if (passwordVerified && (userDetails.currPassword && !userDetails.newPassword)) {
                return toastHelper(toast, "Please provide new password", 'Error', 1000, "destructive")
            }
            if (passwordVerified && (userDetails.newPassword !== userDetails.confirmNewPassword)) {
                return toastHelper(toast, "Password does not match", 'Error', 1000, "destructive")
            }
            let payload = Object.entries(userDetails).filter(([key, value]) => value != null && value !== '')
                .filter(([key, value]) => value !== teacher[key])
            payload = Object.fromEntries(payload)
            if (Object.keys(payload).length === 0) {
                return toastHelper(toast, "No changes detected", 'Info', 1000, "destructive")
            }
            if (payload.newPassword) {
                payload.password = userDetails.newPassword
                delete payload.currPassword
                delete payload.confirmNewPassword
                delete payload.newPassword
            }
            await axios.put(`${apiUrl}/${title.toLowerCase()}/update${title}/${teacher['id']}`, payload, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const updateLocal = () => {
                if (payload.password) {
                    delete payload.password
                }
                const updatedTeacher = { ...teacher, ...payload };
                setTeacher(updatedTeacher); // Update state
                title === 'Teacher' ? localStorage.setItem('teacher', JSON.stringify(updatedTeacher)) :
                    localStorage.setItem('student', JSON.stringify(updatedTeacher))
            }
            updateLocal();
            toastHelper(toast, `${title} Updated`, 'Success', 1000, "success")
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <main>
                <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Settings</h1>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Manage Your {title} Account!</p>
                </header>

                {/* Responsive Container */}
                <section className="p-4 flex flex-col gap-4 w-full">
                    {/* Profile Image Section */}
                    <aside className="flex flex-col items-center gap-4 w-full">
                        <Avatar className="w-40 h-40 md:w-80 md:h-80">
                            <AvatarImage className="object-cover" src={teacher.profile ? `${apiUrl}${teacher.profile}` : "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Button className="cursor-pointer" onClick={handleUpdateProfile}>Upload Photo</Button>
                        <input ref={fileInputRef} onChange={handleFileChange} type="file" className='hidden' accept='image/*' />
                    </aside>

                    {/* Form Section */}
                    <article className="w-full flex flex-col md:flex-row gap-4">
                        <div className="w-full flex flex-col gap-4">
                            <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                            {InputFields('Name', 'text', 'name')}
                            <div className="flex flex-col gap-2">
                                {InputFields('Email', 'email', 'email')}
                            </div>
                            <div className="flex  gap-2">
                                {InputFields(`${title}Id`, 'text', `${title.toLowerCase()}Id`)}
                            </div>
                            <div className="flex flex-col gap-2">
                                {InputFields('Current Password', 'password', 'currPassword')}
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                {passwordVerified && InputFields('New Password', 'password', 'newPassword')}
                                {passwordVerified && InputFields('Confirm New Password', 'password', 'confirmNewPassword')}
                            </div>
                            <footer className="flex justify-center md:justify-start">
                                <Button className="cursor-pointer w-full md:w-auto" onClick={handleTeacherUpdate}>Update</Button>
                            </footer>
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}

export default Settings
