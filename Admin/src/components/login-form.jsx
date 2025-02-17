import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import toastHelper from "@/Helpers/toastHelper"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Loader from "./Loader/Loader"
const apiUrl = import.meta.env.VITE_API_URL;
export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    //if user not filled any field return
    const { email, password } = adminData
    if (!email.trim() || !password.trim()) {
      return toastHelper(toast, 'Please fill all the fields', 'Error', 2000, "destructive")
    }
    //loading state set to true
    setLoading(true)
    try {
      //endpoints to api based on role
      const endpoint = `${apiUrl}/admin/login`

      //payload to send to api
      const payload = { email, password }

      //sending request to api
      const response = await axios.post(endpoint, payload)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        toastHelper(toast, response.data.message, 'Success', 2000)
        navigate(`/admin/dashboard`)
      }
    }
    catch (err) {
      console.log(err);
      toastHelper(toast, err.response.data.message, 'Error', 2000, 'destructive')
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') handleLogin()
    }
    document.addEventListener('keydown', handleEnter)
    return () => document.removeEventListener('keydown', handleEnter)
  }, [handleLogin])

  //check if token is valid and redirect to dashboard
  useEffect(() => {
    document.title = 'Admin Login';
    setLoading(true)
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500)
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')).role : null
    const checkTokenValidation = async () => {
      try {
        const header = token;
        const endPoint = `${apiUrl}/verify-token`
        const response = await axios.post(endPoint, {}, {
          headers: {
            authorization: `Bearer ${header}`
          }
        })
        if (response.status === 200) {
          toastHelper(toast, 'Automatic redirecting...', 'Success', 2000)
          setTimeout(() => {
            navigate('/admin/dashboard')
          }, 2000)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    if (token && role === 'admin') {
      checkTokenValidation()
    }
    return () => clearTimeout(timeout)
  }, [])




  if (loading) {
    return <div className='flex items-center justify-center h-screen'><Loader /></div>
  }
  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleLogin}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your Admin account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="m@example.com" onChange={(e) => setAdminData({ ...adminData, [e.target.name]: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" onChange={(e) => setAdminData({ ...adminData, [e.target.name]: e.target.value })} />
        </div>
        <Button disabled={loading} type="submit" className="w-full cursor-pointer">
          Login
        </Button>
      </div>
    </form>)
  );
}
