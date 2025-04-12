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
  const teacherData = localStorage.getItem('teacher') || null
  const { toast } = useToast()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  // const teacherCourse = useSelector((state) => state.teacherCourse.value)
  const [teacherCourse, setTeacherCourse] = useState(useSelector((state) => state.teacherCourse.value))
  const [teacherSubject, setTeacherSubject] = useState(useSelector((state) => state.teacherSubject.value))
  // const teacherSubject = useSelector((state) => state.teacherSubject.value)

  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  const myStudents = useSelector((state) => state.teachersStudents.value)

  const [filteredStudents, setFilteredStudents] = useState([])

  const [selectedStudents, setSelectedStudents] = useState([])

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
  useEffect(() => {
    if (teacherData) {
      const parsedData = JSON.parse(teacherData)
      setTeacherCourse(parsedData.course)
      setTeacherSubject(parsedData.subjects)
    }
  }, [])

  const handleApplyFilter = () => {
    try {
      setLoading(true)
      if (!date || !selectedCourse || !selectedSubject) {
        alert('Please select a course, and subject')
        return
      }
      let filtered = myStudents.filter((st) => {
        return st.course === selectedCourse && st.subjects.includes(selectedSubject)
      })
      filtered.sort((a, b) => {
        const numA = parseInt(a.studentId.replace(/\D/g, ''), 10);
        const numB = parseInt(b.studentId.replace(/\D/g, ''), 10);
        return numA - numB;
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

  const handleSelectStudent = (student) => {
    if (selectedStudents.includes(student)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== student))
    } else {
      setSelectedStudents([...selectedStudents, student])
    }
  }

  const handleToggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents);
    }
  };

  const checkExistence = (id) => {
    const isExist = selectedStudents.find((student) => student._id === id)
    return isExist ? true : false
  }


  const submitAttendance = async () => {
    if (selectedStudents.length === 0) {
      toastHelper(toast, 'No student Selected', 'Info')
      return
    }
    const attendanceData = {
      students: filteredStudents.map(student => ({
        student_id: student._id,
        status: selectedStudents.includes(student) ? 'Present' : 'Absent'
      })),
      courseId: selectedCourse,
      subjectId: selectedSubject,
      marked_by: teacherDetails.id,
      date
    };
    try {
      const res = await axios.put(`${apiUrl}/teacher/attendance/mark`, attendanceData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toastHelper(toast, res.data.message, 'success');
    } catch (err) {
      toastHelper(toast, err.response?.data?.message || 'Failed to mark attendance', 'error');
    }
  }


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
                <TableCaption>{filteredStudents.length > 0 ? <Button onClick={submitAttendance} className="cursor-pointer">Mark Attendance</Button> : 'No Available Student'}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sno:</TableHead>
                    <TableHead className="">Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Action <span className='ml-2'><Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onClick={handleToggleSelectAll} /></span> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => {
                    return (
                      <TableRow key={student._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell><Checkbox checked={checkExistence(student._id)} onClick={() => handleSelectStudent(student)} /></TableCell>
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
