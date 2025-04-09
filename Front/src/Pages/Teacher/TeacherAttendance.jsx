import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { setData } from '@/Redux/features/students(teachers)/teacherStudentsSlice';
import { format } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@/hooks/use-toast'
import toastHelper from '@/Helpers/toastHelper'
import axios from 'axios'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Loader from '@/components/ui/Loader'
import { Checkbox } from '@/components/ui/checkbox'
const apiUrl = import.meta.env.VITE_API_URL;

const TeacherAttendance = () => {
  const { toast } = useToast()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const teacherCourse = useSelector((state) => state.teacherCourse.value)
  const teacherSubject = useSelector((state) => state.teacherSubject.value)

  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  const myStudents = useSelector((state) => state.teachersStudents.value)

  const [filteredStudents, setFilteredStudents] = useState([])

  const teacherDetails = useMemo(() => JSON.parse(localStorage.getItem('teacher')) || {}, []);
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
    if (myStudents.length === 0) {
      getMyStudents()
    }
  }, [])

  const handleApplyFilter = () => {
    try {
      setLoading(true)
      if (!date || !selectedCourse || !selectedSubject) {
        alert('Please select a date, course, and subject')
        return
      }
      const filtered = myStudents.filter((st) => {
        return st.course === selectedCourse && st.subjects.includes(selectedSubject)
      })
      setFilteredStudents(filtered)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(filteredStudents)
  }, [filteredStudents])
  return (
    <main>
      <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Attendance</h1>
        <p className="text-sm md:text-base text-gray-600 font-medium">
          Mark Attendance
        </p>
      </header>

      <article className="p-4 md:p-6 lg:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">

          {/* Button to open calendar */}
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Course Select */}
          <div className="flex-1">
            <Select onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {teacherCourse.map((course, index) => (
                  <SelectItem key={index} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Select */}
          <div className="flex-1">
            <Select onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {teacherSubject.map((subject, index) => (
                  <SelectItem key={index} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply Filter Button */}
          <Button
            onClick={handleApplyFilter}
            className="w-full md:w-auto cursor-pointer"
          >
            Apply Filter
          </Button>
        </div>
      </article>
      <section className="flex flex-col gap-4 w-full">
        <div className="overflow-x-auto relative">
          {loading ? (
            <div className='absolute top-1/2 left-1/2'><Loader /></div>
          ) : (
            <div className="w-full">
              <Table className="hidden sm:table">
                <TableCaption>{filteredStudents.length>0 ? <Button className="cursor-pointer">Submit</Button> : 'No Available Student'}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sno:</TableHead>
                    <TableHead className="">Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => {
                    return (
                      <TableRow key={student._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell><Checkbox /></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default TeacherAttendance
