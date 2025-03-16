import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from '@/hooks/use-toast';
import { setData } from '@/Redux/features/students(teachers)/teacherStudentsSlice';
import axios from 'axios';
import { Delete } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const apiUrl = import.meta.env.VITE_API_URL;

const TeacherStudent = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const data = useSelector(state => state.teachersStudents.value);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        setSearch(e.target.value.trim().toLowerCase());
    };

    const teacherDetails = JSON.parse(localStorage.getItem('teacher')) || {};

    const getMyStudents = async () => {
        setLoading(true);
        try {
            const payload = {
                course: teacherDetails.course,
                subjects: teacherDetails.subjects
            };
            const response = await axios.post(`${apiUrl}/teacher/myStudents`, payload, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(setData(response.data.students));
            toastHelper(toast, response.data.message, 'success');
        } catch (err) {
            toastHelper(toast, err.response?.data?.message || 'Failed to fetch students', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!data.length) {
            getMyStudents();
        }
    }, [data.length, dispatch, teacherDetails]);

    return (
        <main className='px-4 md:px-6 flex flex-col'>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Students</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">List of Students Under You!</p>
                <section className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                    <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
                        <Input
                            value={search}
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search..."
                            className="flex-1 min-w-[200px] md:w-52"
                        />
                        <Button onClick={getMyStudents} className="cursor-pointer">Refresh</Button>
                    </div>
                </section>
            </header>
            <section className="flex flex-col gap-4 w-full">
                <div className="overflow-x-auto relative">
                    {loading ? (
                        <div className='absolute top-1/2 left-1/2'><Loader /></div>
                    ) : (
                        <div className="w-full">
                            <Table className="hidden sm:table">
                                <TableCaption>A list of your Students</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Sno:</TableHead>
                                        <TableHead className="w-[100px]">Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="text-left">Subjects</TableHead>
                                        <TableHead className="text-left">Course</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? data
                                        .filter(student =>
                                            student.name.toLowerCase().includes(search) ||
                                            student.email.toLowerCase().includes(search) ||
                                            student.studentId.toLowerCase().includes(search)
                                        ).map((student, index) => (
                                            <TableRow key={student._id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{student.studentId}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Subject" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {student.subjects?.map((subject, i) => (
                                                                <SelectItem key={i} value={subject}>{subject}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    {student.course}
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                        <TableRow>
                                            <TableCell colSpan="6" className="text-center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className="sm:hidden flex flex-col gap-4">
                                {data.map((student,index) => (
                                    <div key={student._id} className="border rounded-lg p-4 shadow-md">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-lg">{index+1}</h3>
                                        </div>
                                        <p className="mt-2"><strong>StudentID:{student.studentId}</strong></p>
                                        <p><strong>Name:</strong> {student.name}</p>
                                        <p><strong>Email:</strong> {student.email}</p>
                                        <p><strong>Course:</strong>{student.course}</p>
                                        <p><strong>Subjects:</strong> {student.subjects.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section >
        </main >
    );
};

export default TeacherStudent;
