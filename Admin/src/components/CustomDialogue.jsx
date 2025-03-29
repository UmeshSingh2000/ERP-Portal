import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toastHelper from "@/Helpers/toastHelper"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./Loader/Loader"

const apiUrl = import.meta.env.VITE_API_URL;

export default function CustomDialogue({ title, desc}) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [dialogueState, setDialogueState] = useState(false) // This is the state that will control the dialogue
    const [data, setData] = useState({
        name: "",
        code: ""
    })
    const handleData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value.toUpperCase()
        })
    }
    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!data.name.trim() || !data.code.trim()) {
                toastHelper(toast, "Please fill in all fields", "Error");
                return;
            }
            const response = await axios.post(`${apiUrl}/admin/add${title}`, data, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            toastHelper(toast, response.data.message, 'Success')
            setDialogueState(false)
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, Error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={dialogueState} onOpenChange={setDialogueState}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline">Add {title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add {title}</DialogTitle>
                    <DialogDescription>
                        {desc}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-center">
                            {title} Name
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            name="name"
                            onChange={(e) => handleData(e)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-center">
                            {title} Code
                        </Label>
                        <Input
                            id="username"
                            className="col-span-3"
                            name="code"
                            onChange={(e) => handleData(e)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {loading ? <Loader /> :
                        <Button type="submit" className="cursor-pointer" onClick={handleSubmit}>Save Changes</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
