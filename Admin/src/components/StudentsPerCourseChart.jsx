import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { TrendingUp } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function StudentsPerCourseChart() {
    const [data, setData] = React.useState([

    ]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/student-per-course`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(response.data);
        } catch (err) {
            console.error("Error fetching course data:", err);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="flex flex-col items-center">
            <CardHeader>
                <CardTitle>Students per Course</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid vertical={true} />
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#2563eb" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Course-Wise Student Enrollment <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Tracking student distribution over the last 6 months.
                </div>
            </CardFooter>
        </Card>
    );
}
