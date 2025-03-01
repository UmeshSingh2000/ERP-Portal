import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { SendHorizontal } from 'lucide-react'

const Settings = ({ title }) => {
    const [passwordVerified, setPasswordVerified] = useState(false)
    const InputFields = (label, type, name) => {
        return (
            <div className="w-full relative">
                <Label htmlFor={name} className="text-right">
                    {label}:
                </Label>
                <Input id={name} type={type} className="w-full" />
                {name === 'currPassword' && <SendHorizontal className='absolute top-1/2 right-3 w-4 cursor-pointer hover:w-6 transition-all' />}
            </div>
        )
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
                            <AvatarImage className="object-cover" src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Button className="cursor-pointer">Upload Photo</Button>
                        {/* <input ref={fileInputRef} onChange={handleFileChange} type="file" className='hidden' accept='image/*' /> */}
                    </aside>

                    {/* Form Section */}
                    <article className="w-full flex flex-col md:flex-row gap-4">
                        <div className="w-full flex flex-col gap-4">
                            <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                            {InputFields('Name', 'text', 'fullName')}
                            <div className="flex flex-col gap-2">
                                {InputFields('Email', 'email', 'email')}
                            </div>

                            <div className="flex flex-col gap-2">
                                {InputFields('Phone Number', 'text', 'phoneNumber')}

                            </div>
                            <div className="flex flex-col gap-2">
                                {InputFields('Current Password', 'password', 'currPassword')}
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                {passwordVerified && InputFields('New Password', 'password', 'newPassword')}
                                {passwordVerified && InputFields('Confirm New Password', 'password', 'confirmNewPassword')}
                            </div>
                            <footer className="flex justify-center md:justify-start">
                                <Button className="cursor-pointer w-full md:w-auto">Update</Button>
                            </footer>
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}

export default Settings
