import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData as courseData } from '@/ReduxStore/Features/Courses/courseSlice';

const apiUrl = import.meta.env.VITE_API_URL;

const CourseChart = () => {
    const dispatch = useDispatch();
    const courses = useSelector((state) => state.courses.value);
    const [totalCourses, setTotalCourses] = useState(0);
    
    // Function to detect if the current theme is dark or light

    const getCourses = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/getCourses`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const courseList = response.data.courses;
            dispatch(courseData(courseList));
            setTotalCourses(courseList.length);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        if (courses.length === 0) {
            getCourses();
        } else {
            setTotalCourses(courses.length);
        }
    }, [courses.length]);

    const chartData = [{ name: "Courses", value: totalCourses, fill: "#FF7F50" }]; // Coral color

    return (
        <Card className="flex flex-col items-center text-center bg-card shadow-lg">
            <CardHeader className="pb-0">
                <CardTitle className="text-foreground">Total Courses</CardTitle>
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
                    <PolarAngleAxis type="number" domain={[0, Math.max(10, totalCourses)]} angleAxisId={0} tick={false} />
                    <RadialBar
                        minAngle={15}
                        clockWise
                        dataKey="value"
                        fill="#FF7F50"  // Coral Orange
                        background={{ fill: "#374151" }} // Gray background
                    />
                </RadialBarChart>
                {/* Adaptive Text Color */}
                <span
                    className={`absolute text-4xl font-bold text-black dark:text-white`}
                >
                    {totalCourses}
                </span>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none text-foreground">
                    {totalCourses > 0 ? "New courses added recently!" : "No courses available yet."}
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total courses in the system
                </div>
            </CardFooter>
        </Card>
    );
};

export default CourseChart;
