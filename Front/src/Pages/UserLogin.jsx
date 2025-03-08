import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/Loader'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const apiUrl = import.meta.env.VITE_API_URL;



const UserLogin = () => {
    const { toast } = useToast()
    const [activeRole, setActiveRole] = useState("student")
    const [id, setId] = useState('')
    const [pass, setPass] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    //login button handler
    const handleLogin = async () => {
        //if user not filled any field return
        if (!id.trim() || !pass.trim()) {
            return toast({
                variant: "destructive",
                title: "Please fill all the fields.",
            })
        }
        //loading state set to true
        setLoading(true)
        try {
            //endpoints to api based on role
            const endpoint = `${apiUrl}/${activeRole}/login`

            //payload to send to api
            const payload = (activeRole === 'student') ? { studentId: id, password: pass } : { teacherId: id, password: pass }

            //sending request to api
            const response = await axios.post(endpoint, payload)

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
                toast({
                    title: response.data.message
                })
                navigate(`/${activeRole}/dashboard`)
            }
        }
        catch (err) {
            return toast({
                variant: "destructive",
                title : "Error",
                description: err.response.data?.message
            })
        }
        finally {
            setLoading(false)
        }
    }
    if (loading) {
        return <div className='flex items-center justify-center h-screen'><Loader /></div>
    }
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <img
                    lazy = 'true'
                    src="https://picsum.photos/1280/720?random"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <main className='w-full h-dvh flex items-center justify-center flex-col'>
                <Tabs defaultValue="student" className="w-[300px] sm:w-[500px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="student" onClick={() => {
                            setId('')
                            setPass('')
                            setActiveRole('student')
                            toast({
                                title: 'Student Selected',
                                'description': 'Please enter your student credentials to proceed.'
                            })
                        }}>Student</TabsTrigger>
                        <TabsTrigger value="teacher" onClick={() => {
                            setId('')
                            setPass('')
                            setActiveRole('teacher')
                            toast({
                                title: 'Teacher Selected',
                                'description': 'Please enter your teacher credentials to proceed.'
                            })
                        }}>Teacher</TabsTrigger>
                    </TabsList>
                    <TabsContent value="student">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Login</CardTitle>
                                <CardDescription>
                                    Enter your student credentials to proceed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="studentId" className="">Student ID:</Label>
                                    <Input id="studentId" placeholder="Enter your Student ID" value={id} onChange={(e) => setId(e.target.value.toUpperCase())} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="studentPassword" className="">Password:</Label>
                                    <Input id="studentPassword" type="password" placeholder="Enter your password" value={pass} onChange={(e) => setPass(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleLogin}>Login</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="teacher">
                        <Card>
                            <CardHeader>
                                <CardTitle>Teacher Login</CardTitle>
                                <CardDescription>
                                    Enter your teacher credentials to proceed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="teacherId" className="">Teacher ID:</Label>
                                    <Input id="teacherId" placeholder="Enter your Teacher ID" value={id} onChange={(e) => setId(e.target.value.toUpperCase())} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="teacherPassword">Password:</Label>
                                    <Input id="teacherPassword" type="password" placeholder="Enter your password" value={pass} onChange={(e) => setPass(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleLogin}>Login</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
export default UserLogin;
