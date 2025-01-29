import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
const Settings = () => {
    const fileInputRef = useRef()
    const [image, setImage] = useState(null)
    const admin = JSON.parse(localStorage.getItem('admin'))
    const handleUpdateProfile = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setImage(file)
        await uploadImage(file)
    }

    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file)
            const response = await axios.put(`${apiUrl}/admin/updateProfile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log("Upload Successful:", response.data);
        }
        catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        console.log(`${apiUrl}${admin.profile}`)
    })
    return (
        <>
            <section>
                <header>
                    <h1 className='font-bold text-3xl'>Settings</h1>
                </header>
                <main className='flex gap-5'>
                    <aside>
                        <div className='w-full'>
                            {admin?.profile ? <img src={`${apiUrl}${admin.profile}`} alt="profile" className="w-72 h-72 object-cover rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-72 rounded-full" />}
                            <p className='text-right cursor-pointer text-2xl' onClick={handleUpdateProfile}><i className="fa-solid fa-pencil"></i>Edit</p>
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
