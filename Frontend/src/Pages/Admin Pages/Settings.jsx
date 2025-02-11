import React, { useCallback, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice'
import Loader from '../../Componenets/Loader'
const apiUrl = import.meta.env.VITE_API_URL
const Settings = () => {
    let admin = JSON.parse(localStorage.getItem('admin'))
    const [userDetails, setUserDetails] = useState({
        fullName: admin?.fullName,
        phoneNumber: admin?.phoneNumber,
        email: admin?.email,
        password: "",
        newPassword: "",
        confirmPassword: ""
    })
    const inputFields = useCallback((placeholder, type = "text", label, name, disable = false) => {
        return (
            <div>
                <label className=''>{label}</label>
                <input disabled={disable} type={type} name={name} placeholder={placeholder} className='border-[#D4D4D4] border rounded-md w-full p-2 text-sm focus:outline-none focus:border-blue-500' value={userDetails[name] || ""} onChange={(e) => setUserDetails({ ...userDetails, [name]: e.target.value })} />
            </div>)
    }, [userDetails])
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const [loading, setLoading] = useState(false)

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
    const handleAdminUpdate = async () => {
        try {
            setLoading(true)
            if (!userDetails.password && userDetails.newPassword) {
                return dispatch(setToastWithTimeout({ type: 'error', message: "Please provide current password" }));
            }
            if (userDetails.password && !userDetails.newPassword) {
                return dispatch(setToastWithTimeout({ type: 'error', message: "Please provide new password" }));
            }
            if (userDetails.newPassword !== userDetails.confirmPassword) {
                return dispatch(setToastWithTimeout({ type: 'error', message: "Password does not match" }));
            }
            let payload = Object.entries(userDetails).filter(([key, value]) => value != null && value !== '')
                .filter(([key, value]) => value !== admin[key])
            payload = Object.fromEntries(payload)
            if (Object.keys(payload).length === 0) {
                return dispatch(setToastWithTimeout({ type: 'info', message: "No changes detected" }));
            }
            console.log(payload)
            await axios.put(`${apiUrl}/admin/updateAdmin`, payload, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // complete this!!!!!!!!!!!!
            const updateLocal = () => {
                if (payload.password) {
                    delete payload.password
                    delete payload.newPassword
                }
                admin = { ...admin, ...payload }

                localStorage.setItem('admin', JSON.stringify(admin))
            }
            updateLocal();
            dispatch(setToastWithTimeout({ type: 'success', message: "Admin Updated" }));
        }
        catch (err) {
            console.error(err)
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }));
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <div className='absolute top-1/2 left-1/2 '>
                <Loader />
            </div> : <section className='w-full h-auto p-5'>
                <header>
                    <h1 className='font-bold text-3xl'>Settings</h1>
                </header>
                <main className='flex gap-5'>
                    <aside>
                        <div className='w-full'>
                            {admin?.profile ? <img src={`${apiUrl}${admin.profile}`} alt="profile" className="w-72 h-72 object-cover rounded-full" /> : <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png" alt="profile" className="w-72 rounded-full" />}
                            <p className='text-center font-thin hover:bg-[#212121] hover:text-white transition-all duration-500 mt-2 rounded cursor-pointer text-xl' onClick={handleUpdateProfile}><i className="fa-solid fa-pencil mr-1"></i>Edit</p>
                            <input ref={fileInputRef} onChange={handleFileChange} type="file" className='hidden' accept='image/*' />
                        </div>
                    </aside>
                    <main className='w-2/3 flex flex-col gap-2'>
                        <header>
                            <h1 className='text-2xl font-bold underline'>My Profile</h1>
                        </header>
                        {inputFields("Ex. John Doe", "", "Full Name", "fullName")}
                        <div className='relative'>
                            {inputFields("Ex. xyz@gmail.com", "email", "Email", 'email', true)}
                            <p className='absolute right-2 top-1/2 cursor-pointer'>Send OTP</p>
                        </div>
                        {inputFields("Ex. 9876543210", "text", "Phone Number", 'phoneNumber', true)}
                        <div className='flex gap-5'>
                            {inputFields("Password...", "password", "Current Password", "password")}
                            {inputFields("Password...", "password", "New Password", "newPassword")}
                            {inputFields("Password...", "password", "Confirm New Password", "confirmPassword")}
                        </div>
                        <button className='bg-[#212121] text-white p-2 w-40 rounded text-sm' onClick={handleAdminUpdate}>Save</button>
                    </main>
                </main>
            </section>}
        </>
    )
}
export default Settings
