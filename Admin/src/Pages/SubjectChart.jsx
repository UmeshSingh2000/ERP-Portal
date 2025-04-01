import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { setData as subjectData } from '@/ReduxStore/Features/Subjects/subjectSlices';

const apiUrl = import.meta.env.VITE_API_URL;

const SubjectChart = () => {
    const dispatch = useDispatch();
    const subjects = useSelector((state) => state.subjects.value);
    const [totalSubjects, setTotalSubjects] = useState(0);

    // Fetch subjects from backend
    const getSubjects = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/getSubjects`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const subjectList = response.data.subjects;
            dispatch(subjectData(subjectList));
            setTotalSubjects(subjectList.length);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (subjects.length === 0) {
            getSubjects();
        } else {
            setTotalSubjects(subjects.length);
        }
    }, [subjects.length]);

    // Chart data
    const chartData = [{ name: "Subjects", value: totalSubjects, fill: "#3B82F6" }]; // Always blue

    return (
        <Card className="flex flex-col items-center text-center bg-card shadow-lg">
            <CardHeader className="pb-0">
                <CardTitle className="text-foreground">Total Subjects</CardTitle>
                <CardDescription className="text-muted-foreground">Currently enrolled in the system</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center relative">
                <RadialBarChart
                    width={200}
                    height={200}
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    barSize={15}
                    data={chartData}
                    startAngle={90}
                    endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 20]} angleAxisId={0} tick={false} />
                    <RadialBar
                        minAngle={15}
                        clockWise
                        dataKey="value"
                        fill="#3B82F6"  // Always blue
                        
                        background={{ fill: "hsl(var(--background-muted))" }} // Muted background
                    />
                </RadialBarChart>
                {/* Adaptive Text Color */}
                <span className="absolute text-4xl font-bold text-black dark:text-white">
                    {totalSubjects}
                </span>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none text-foreground">
                    Total subjects currently available. <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total subjects in the system
                </div>
            </CardFooter>
        </Card>
    );
}

export default SubjectChart;
