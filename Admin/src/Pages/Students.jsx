import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import toastHelper from '@/Helpers/toastHelper';
import { Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import axios from 'axios';
import { setData } from '@/ReduxStore/Features/Students/studentsSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleAddFromExcel from '@/components/MultipleAddFromExcel';
import Loader from '@/components/Loader/Loader';
import CustomTable from '@/components/CustomTable';
const apiUrl = import.meta.env.VITE_API_URL;


const Students = () => {
  const { toast } = useToast()
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const studentData = useSelector((state) => state.students.value);
  const [duplicateStudentData, setDuplicateStudentData] = useState(studentData);
  const [selectedStudent, setSelectedStudent] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [addStudentData, setAddStudentData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    course: "",
    subjects: ""
  })
  const InputFields = (label, type, name) => {
    return (
      <div className="w-full md:w-md">
        <div className="">
          <Label htmlFor={name} className="text-right">
            {label}
          </Label>
          <Input id={name} type={type} value={addStudentData[name]} onChange={(e) => setAddStudentData({ ...addStudentData, [name]: e.target.value })} />
        </div>
      </div>
    )
  }

  /**
     * @function handleSearch
     * @param {object} e 
     * @returns set search value and filter student data default det to studentData(full data) from db
     * @description This function search student by name and filter student data
     */
  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSearch(value);

    if (value === '') {
      setDuplicateTeacherData(studentData);
    } else {
      const filteredData = studentData.filter(({ name = "", email = "", studentId = "", course = "" }) =>
        name.toLowerCase().includes(value) ||
        email.toLowerCase().includes(value) ||
        studentId.toLowerCase().includes(value) ||
        course.toLowerCase().includes(value)
      );
      setDuplicateStudentData(filteredData);
    }
    setCurrentPage(1);
  };

  const handleDelete = async (studentId, name) => {
    const confirm = window.confirm(`Are you sure you want to delete this teacher : ${name}?`)
    if (!confirm) return
    try {
      const response = await axios.delete(`${apiUrl}/admin/deleteStudent/${studentId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.status === 200) {
        toastHelper(toast, response.data.message, 'success')
      }
    }
    catch (err) {
      toastHelper(toast, err.response.data.message, 'Error', 1000, "destructive")
    }
  }

  const fetchData = useCallback(async () => {
    setSearch('')
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/admin/getStudents`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(setData(response.data.students));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    setDuplicateStudentData(studentData);
  }, [studentData]);
  useEffect(() => {
    if (studentData.length > 0) return;
    fetchData();
  }, [studentData.length, fetchData]);

  return (
    <>
      <main className="px-4 md:px-6 h-screen flex flex-col">
        {/* Header Section */}
        <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Students</h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">Manage Students</p>

          {/* Search & Actions */}
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
            {/* Search and Refresh */}
            <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
              <Input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder="Search..."
                className="flex-1 min-w-[200px] md:w-52"
              />

              <Button className="cursor-pointer" onClick={fetchData}>Refresh</Button>
              <Button className={`${selectedStudent.length > 1 ? 'block' : 'hidden'} cursor-pointer bg-red-500`}><Delete /></Button>
            </div>

            {/* Add Buttons */}
            <div className="flex w-full md:w-auto items-center gap-2 justify-center md:justify-end flex-wrap">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <p className="bg-primary font-medium text-sm px-3 text-primary-foreground shadow hover:bg-primary/90 p-2 rounded-md cursor-pointer">Add Student</p>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-center text-3xl font-bold">Add Student</DrawerTitle>
                    <DrawerDescription className="text-center text-sm">Enter details to add a new Student</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="flex flex-col items-center justify-center">
                      {InputFields("Name", "text", "name")}
                      {InputFields("StudentId", "text", "studentId")}
                      {InputFields("Email", "email", "email")}
                      {InputFields("Password", "password", "password")}
                      {InputFields("Course", "text", "course")}
                      {InputFields("Subjects", "text", "subjects")}
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button className="w-xs m-auto cursor-pointer" type="submit">Add</Button>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <MultipleAddFromExcel />
              {/* <Button className="cursor-pointer bg-green-500">Add Multiple Teachers</Button> */}
            </div>
          </div>
        </header>

        {/* Table Section */}
        <section className="overflow-x-auto overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          ) : (
            <CustomTable
              data={duplicateStudentData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              deleteTeacher={handleDelete}
              selectedTeacher={selectedStudent}
              setSelectedTeacher={setSelectedStudent}
              title = "Student"
            />
          )}
        </section>
      </main>
    </>
  )
}

export default Students
