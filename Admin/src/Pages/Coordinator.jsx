import CustomDialogue from '@/components/CustomDialogue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toastHelper from '@/Helpers/toastHelper';
import { useToast } from '@/hooks/use-toast';
import { setData as teacherRedux } from '@/ReduxStore/Features/Teachers/teacherSlices';
import { setData } from '@/ReduxStore/Features/Courses/courseSlice';
import { setData as coordinatorRedux } from '@/ReduxStore/Features/Coordinators/coordinatorsSlice';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@/components/Loader/Loader';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Delete } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

const Coordinator = () => {
    const coordinators = useSelector((state) => state.coordinators.value);
    const [filteredCoordinators, setFilteredCoordinators] = useState(coordinators);
    const teacherData = useSelector((state) => state.teachers.value);
    const courses = useSelector((state) => state.courses.value);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCoordinator, setSelectedCoordinator] = useState({ name: "", courseName: "" });

    const fetCoordinator = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/admin/getCoordinators`, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(coordinatorRedux(response.data.coordinators));
        } catch (err) {
            toastHelper(toast, err.response.data.message, 'Error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/admin/getCourses`, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(setData(response.data.courses));
        } catch (err) {
            toastHelper(toast, err.response.data.message, 'Error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeacher = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/admin/getTeachers`, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            dispatch(teacherRedux(response.data.teachers));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const handleUpdate = async (id) => {
        if (!selectedCoordinator.name.trim() || !selectedCoordinator.courseName.trim()) {
            toastHelper(toast, "Please fill all fields", "Error");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.put(`${apiUrl}/admin/updateCoordinator/${id}`, selectedCoordinator, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toastHelper(toast, response.data.message, "Success");
            fetCoordinator(); // Refresh the coordinator list after successful update
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message 
                ? err.response.data.message 
                : "Update failed";
            toastHelper(toast, errorMessage, "Error");
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (id) => {
        const confirmDelete = confirm("Do you want to delete this Coordinator?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/admin/deleteCoordinator/${id}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toastHelper(toast, response.data.message, 'Success');
            fetCoordinator();
        } catch (err) {
            toastHelper(toast, err.response?.data?.message || "Delete failed", 'Error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (courses.length === 0) fetchCourse();
        if (teacherData.length === 0) fetchTeacher();
        if (coordinators.length === 0) fetCoordinator();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredCoordinators(coordinators);
        } else {
            const filtered = coordinators.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.courseName.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredCoordinators(filtered);
        }
    }, [search, coordinators]);

    return (
        <main className="px-4 md:px-6 flex flex-col">
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Coordinator</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">Manage Coordinators</p>
            </header>

            <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 min-w-[200px] md:w-52"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={fetCoordinator}>Refresh</Button>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2 justify-center md:justify-end flex-wrap">
                    <CustomDialogue
                        desc="Create Coordinator for the selected course"
                        title="Coordinator"
                        courses={courses}
                        teachers={teacherData}
                    />
                </div>
            </div>

            <div className="overflow-x-auto mt-5">
                {loading ? <div className='absolute top-1/2 left-1/2'><Loader /></div> :
                    <div className="w-full">
                        <Table className="hidden sm:table">
                            <TableCaption>A list of Coordinators</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Sno:</TableHead>
                                    <TableHead className="text-center">Coordinator Name</TableHead>
                                    <TableHead className="text-center">Course Assigned</TableHead>
                                    <TableHead className="text-end">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCoordinators.map((coordinator, index) => (
                                    <Drawer key={coordinator._id}>
                                        <DrawerTrigger asChild>
                                            <TableRow onClick={() => setSelectedCoordinator({ name: coordinator.name, courseName: coordinator.courseName })} className="cursor-pointer">
                                                <TableHead>{index + 1}</TableHead>
                                                <TableHead className="text-center">{coordinator.name}</TableHead>
                                                <TableHead className="text-center">{coordinator.courseName}</TableHead>
                                                <TableHead className="flex justify-end mr-2">
                                                    <Delete onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(coordinator._id);
                                                    }} className="cursor-pointer hover:scale-110 transition" />
                                                </TableHead>
                                            </TableRow>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader>
                                                <DrawerTitle className='text-center'>Edit Coordinator</DrawerTitle>
                                                <DrawerDescription className="text-center">Update coordinator information.</DrawerDescription>
                                            </DrawerHeader>
                                            <div className="w-full flex justify-center items-center">
                                                <div className="w-full max-w-sm space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium">Coordinator Name</label>
                                                        <Input value={selectedCoordinator.name} onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, name: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium">Course Name</label>
                                                        <Input value={selectedCoordinator.courseName} onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, courseName: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <DrawerFooter className="flex flex-col items-center mt-4">
                                                <Button className="w-40" onClick={() => handleUpdate(coordinator._id)}>Save Changes</Button>
                                                <DrawerClose>Cancel</DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                }
            </div>

            {/* Mobile View */}
            <div className="sm:hidden flex flex-col gap-4">
                {filteredCoordinators.map((coordinator, index) => (
                    <Drawer key={coordinator._id}>
                        <DrawerTrigger asChild>
                            <div className="border rounded-lg p-4 shadow-md cursor-pointer" onClick={() => setSelectedCoordinator(coordinator)}>
                                <p className="font-semibold">#{index + 1}</p>
                                <p><strong>Name:</strong> {coordinator.name}</p>
                                <p><strong>Course:</strong> {coordinator.courseName}</p>
                                <div className="flex justify-end mt-2">
                                    <Delete className='cursor-pointer text-red-500' onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(coordinator._id)
                                    }} />
                                </div>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Edit Coordinator</DrawerTitle>
                                <DrawerDescription>Update coordinator information.</DrawerDescription>
                            </DrawerHeader>
                            <div className="w-full flex justify-center items-center">
                                <div className="w-full max-w-sm flex flex-col gap-2">
                                    <label className="block text-sm font-medium">Coordinator Name</label>
                                    <Input value={selectedCoordinator.name} onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, name: e.target.value })} />
                                    <label className="block text-sm font-medium">Course Name</label>
                                    <Input value={selectedCoordinator.courseName} onChange={(e) => setSelectedCoordinator({ ...selectedCoordinator, courseName: e.target.value })} />
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button onClick={() => handleUpdate(coordinator._id)}>Save</Button>
                                <DrawerClose>Cancel</DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ))}
            </div>
        </main>
    );
};

export default Coordinator;
