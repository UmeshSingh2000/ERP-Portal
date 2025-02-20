import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/ReduxStore/Features/Theme/themeSlices";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.value)

    useEffect(() => {
        console.log(theme)
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <Button className="cursor-pointer" variant="ghost" onClick={() => dispatch(toggleTheme())}>
            <p className='font-medium text-sm'>{theme.slice(0,1).toUpperCase().concat(theme.slice(1))}</p>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-6 w-6" />}
        </Button>
    );
}
