import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Scale } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;



export default function StudentTeacherChart() {
    const [data, setData] = React.useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/count`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // console.log(response.data)
            setData([
                { name: "Student", value: response.data.studentCount, color: "#e23670" },
                { name: "Teacher", value: response.data.teacherCount, color: "#60a5fa" }
            ])
        }
        catch (err) {
            console.log(err)
        }
    }
    React.useEffect(() => {
        fetchData()
    }, [])
    return (
        <Card className="flex flex-col items-center bg-transparent">
            <CardHeader>
                <CardTitle>Student vs Teacher Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
                <PieChart width={300} height={300}>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Balanced Academic Structure <Scale className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Reflecting the proportion of students and teachers in the institution.
                </div>
            </CardFooter>
        </Card>
    );
}