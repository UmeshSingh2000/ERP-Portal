import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { toggleTheme } from '@/Redux/features/Theme/themeSlices'

const ThemeToggle = () => {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.theme.value)
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme])
    return (
        <>
            <Button className="cursor-pointer" variant="ghost" onClick={() => dispatch(toggleTheme())}>
                <p className='font-medium text-sm'>{theme.slice(0, 1).toUpperCase().concat(theme.slice(1))}</p>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-6 w-6" />}
            </Button>
        </>
    )
}

export default ThemeToggle
