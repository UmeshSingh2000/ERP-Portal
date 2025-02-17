import React from 'react'
import { LoginForm } from "@/components/login-form"
import img from '../assets/logo.ico'
const AdminLogin = () => {
    return (
        <>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="/" className="flex items-center gap-2 font-medium">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                {/* <GalleryVerticalEnd className="size-4" /> */}
                                <img src={img} alt="" className='w-5 object-cover'/>
                            </div>
                            ERP
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <LoginForm />
                        </div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <img
                        lazy='true'
                        src="https://picsum.photos/1280/720?random"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    )
}

export default AdminLogin
