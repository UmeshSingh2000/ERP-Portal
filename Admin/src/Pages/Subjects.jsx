import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import CustomDialogue from '@/components/CustomDialogue'
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setData } from '@/ReduxStore/Features/Subjects/subjectSlices';
import { useToast } from '@/hooks/use-toast';
import toastHelper from '@/Helpers/toastHelper';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loader from '@/components/Loader/Loader';
import { Delete } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
const apiUrl = import.meta.env.VITE_API_URL

const Subjects = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const [search, setSearch] = useState('');
    const subjects = useSelector(state => state.subjects.value)
    const [filteredSubject, setFilteredSubject] = useState(subjects)
    const [selectedSubject, setSelectedSubject] = useState({ subjectCode: "", subjectName: "" });


    const fetchSubjects = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiUrl}/admin/getSubjects`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setData(response.data.subjects))
        }
        catch (err) {
            toastHelper(toast, err.response.data.message, 'Error')
        }
        finally {
            setLoading(false)
        }
    }


    const handleDelete = async (id) => {
        const confirmDelete = confirm('Do you want to delete this Subject')
        if (confirmDelete) {
            setLoading(true)
            try {
                const response = await axios.delete(`${apiUrl}/admin/deleteSubject/${id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                toastHelper(toast, response.data.message, 'Success')
            }
            catch (err) {
                toastHelper(toast, err.response.data.message, 'Error')
            }
            finally {
                setLoading(false)
            }
        }

    }

    const handleUpdate = async (id) => {
        try {
            if (!selectedSubject.subjectCode && !selectedSubject.subjectName) {
                toastHelper(toast, "Please fill in all fields", "Error");
                return;
            }

            setLoading(true);
            const response = await axios.put(
                `${apiUrl}/admin/updateSubject/${id}`,
                selectedSubject,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toastHelper(toast, response.data.message, "Success");
            fetchSubjects(); // Refresh the subjects list
        } catch (err) {
            toastHelper(toast, err.response?.data?.message || "Update failed", "Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!search) {
            setFilteredSubject(subjects);
        } else {
            const filtered = subjects.filter(subject =>
                subject.subjectName.toLowerCase().includes(search.toLowerCase()) ||
                subject.subjectCode.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredSubject(filtered);
        }
    }, [search, subjects]);

    useEffect(() => {
        if (subjects.length !== 0) return
        fetchSubjects()
    }, [])

    return (
        <>
            <main className="px-4 md:px-6 flex flex-col">
                {/* Header Section */}
                <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Subjects</h1>
                    <p className="text-sm md:text-base text-gray-600 font-medium">Manage Subjects</p>
                </header>
                <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                    <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 min-w-[200px] md:w-52"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button className="cursor-pointer" onClick={fetchSubjects}>Refresh</Button>
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-2 justify-center md:justify-end flex-wrap">
                        <CustomDialogue
                            desc="Create a new subject to streamline course management and record-keeping."
                            title="Subject"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto mt-5">
                    {loading ? <div className='absolute top-1/2 left-1/2'><Loader /></div> :
                        <div className="w-full">
                            {/* Table for Larger Screens */}
                            <Table className="hidden sm:table">
                                <TableCaption>A list of Subjects</TableCaption>
                                <TableHeader className="">
                                    <TableRow>
                                        <TableHead className="w-[50px]">Sno:</TableHead>
                                        <TableHead className="text-center">Subject Code</TableHead>
                                        <TableHead className="text-center">Subject Name</TableHead>
                                        <TableHead className="text-end">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubject.map((subject, index) => (
                                        <Drawer key={subject._id}>
                                            <DrawerTrigger asChild>
                                                <TableRow onClick={() => setSelectedSubject({ subjectCode: subject.subjectCode, subjectName: subject.subjectName })} className="cursor-pointer">
                                                    <TableHead>{index + 1}</TableHead>
                                                    <TableHead className="text-center">{subject.subjectCode}</TableHead>
                                                    <TableHead className="text-center">{subject.subjectName}</TableHead>
                                                    <TableHead className='flex justify-end items-center mr-2'>
                                                        <Delete
                                                            className='cursor-pointer hover:scale-125 transition-all duration-200'
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent row click from opening drawer
                                                                handleDelete(subject._id);
                                                            }}
                                                        />
                                                    </TableHead>
                                                </TableRow>
                                            </DrawerTrigger>
                                            <DrawerContent className="flex flex-col items-center">
                                                <DrawerHeader className="text-center">
                                                    <DrawerTitle>Edit Subject</DrawerTitle>
                                                    <DrawerDescription>Modify the subject details below.</DrawerDescription>
                                                </DrawerHeader>
                                                <div className="w-full max-w-sm space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium">Subject Code</label>
                                                        <Input
                                                            value={selectedSubject.subjectCode}
                                                            onChange={(e) => setSelectedSubject({ ...selectedSubject, subjectCode: e.target.value.toUpperCase() })}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium">Subject Name</label>
                                                        <Input
                                                            value={selectedSubject.subjectName}
                                                            onChange={(e) => setSelectedSubject({ ...selectedSubject, subjectName: e.target.value.toUpperCase() })}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <DrawerFooter className="w-full flex flex-col items-center mt-4">
                                                    <Button className="w-40 cursor-pointer" onClick={() => handleUpdate(subject._id)}>Save Changes</Button>
                                                    <DrawerClose className='cursor-pointer'>
                                                        Cancel
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    }
                </div>
                <div className="sm:hidden flex flex-col gap-4">
                    {filteredSubject.map((subject, index) => (
                        <Drawer key={subject._id}>
                            <DrawerTrigger asChild>
                                <div className="border rounded-lg p-4 shadow-md cursor-pointer" onClick={() => setSelectedSubject(subject)}>
                                    <p className="font-semibold">#{index + 1}</p>
                                    <p><strong>Subject Code:</strong> {subject.subjectCode}</p>
                                    <p><strong>Subject Name:</strong> {subject.subjectName}</p>
                                    <div className="flex justify-end mt-2">
                                        <Delete className='cursor-pointer text-red-500' onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(subject._id)
                                        }} />
                                    </div>
                                </div>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Edit Subject</DrawerTitle>
                                    <DrawerDescription>Modify the details.</DrawerDescription>
                                </DrawerHeader>
                                <div className='flex flex-col gap-2'>
                                    <div>
                                        <label className="block text-sm font-medium">Subject Code</label>
                                        <Input value={selectedSubject.subjectCode} onChange={(e) => setSelectedSubject({ ...selectedSubject, subjectCode: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Subject Code</label>
                                        <Input value={selectedSubject.subjectName} onChange={(e) => setSelectedSubject({ ...selectedSubject, subjectName: e.target.value })} />
                                    </div>
                                </div>
                                <DrawerFooter>
                                    <Button className="cursor-pointer" onClick={()=>handleUpdate(subject._id)}>Save</Button>
                                    <DrawerClose className='cursor-pointer'>Cancel</DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    ))}
                </div>
            </main>
        </>
    )
}

export default Subjects
