import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
const apiUrl = import.meta.env.VITE_API_URL


const AdminSettings = () => {

  const [optToggle, setOtpToggle] = useState(false)
  let admin = JSON.parse(localStorage.getItem('admin'))

  const [userDetails, setUserDetails] = useState({
    fullName: admin?.fullName,
    phoneNumber: admin?.phoneNumber,
    email: admin?.email,
    password: "",
    newPassword: "",
    confirmPassword: ""
  })

  const InputFields = (label, type, name) => {
    return (
      <div className="w-full">
        <Label htmlFor={name} className="text-right">
          {label}:
        </Label>
        <Input id={name} type={type} value={userDetails[name]} className="w-full" />
      </div>
    )
  }
  return (
    <>
      <main>
        <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Settings</h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">Manage Your Admin Account!</p>
        </header>

        {/* Responsive Container */}
        <section className="p-4 flex flex-col gap-4 w-full">
          {/* Profile Image Section */}
          <aside className="flex flex-col items-center gap-4 w-full">
            <Avatar className="w-40 h-40 md:w-80 md:h-80">
              <AvatarImage className="object-cover" src={admin.profile ? `${apiUrl}${admin.profile}` : "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button className="cursor-pointer">Upload Photo</Button>
          </aside>

          {/* Form Section */}
          <article className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
              <div className="flex flex-col md:flex-row gap-2">
                {InputFields('Name', 'text', 'fullName')}
                {InputFields('Email', 'email', 'email')}
              </div>

              <div className="flex flex-col gap-2">
                {InputFields('Phone Number', 'text', 'phoneNumber')}
                <div className='flex flex-col gap-2'>
                  <Button className="w-full md:w-32 cursor-pointer">Send OTP</Button>
                  {optToggle && <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  }
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {InputFields('Current Password', 'password', 'currPassword')}
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                {InputFields('New Password', 'password', 'newPassword')}
                {InputFields('Confirm New Password', 'password', 'confirmNewPassword')}
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

export default AdminSettings
