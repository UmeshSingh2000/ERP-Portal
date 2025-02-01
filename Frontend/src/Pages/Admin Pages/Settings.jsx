import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice'
import Loader from '../../Componenets/Loader'
const apiUrl = import.meta.env.VITE_API_URL
const Settings = () => {
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const [loading, setLoading] = useState(false)
    const admin = JSON.parse(localStorage.getItem('admin'))
    const handleUpdateProfile = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    /**
     * @description Handle file change
     */
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        await uploadImage(file)
    }
    /**
     * @description Upload admin profile picture
     * @param {File} file - The image file to upload
     */
    const uploadImage = async (file) => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('image', file)
            const response = await axios.put(`${apiUrl}/admin/updateProfile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }))
            setTimeout(() => dispatch(setToastWithTimeout({ type: 'info', message: "Refresh to Update" })), 500)
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <section>
                <header>
                    <h1 className='font-medium text-3xl'>Settings</h1>
                </header>
                <main className='flex gap-5'>
                    <aside>
                        <div className='w-full'>
                            {loading ? <Loader /> : admin?.profile ? <img src={`${apiUrl}${admin.profile}`} alt="profile" className="w-72 h-72 object-cover rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-72 rounded-full" />}
                            <p className='text-center font-thin hover:bg-[#3E3CCC] hover:text-white transition-all duration-500 mt-2 rounded cursor-pointer text-xl' onClick={handleUpdateProfile}><i className="fa-solid fa-pencil mr-1"></i>Edit</p>
                            <input ref={fileInputRef} onChange={handleFileChange} type="file" className='hidden' accept='image/*' />
                        </div>
                    </aside>
                    <main>
                        <h1>My Profile</h1>
                    </main>
                </main>
            </section>
        </>
    )
}
export default Settings
