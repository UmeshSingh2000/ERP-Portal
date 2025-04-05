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
  import { format } from 'date-fns'
  import React, { useState } from 'react'
  import { useSelector } from 'react-redux'
  
  const TeacherAttendance = () => {
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date())
    const teacherCourse = useSelector((state) => state.teacherCourse.value)
    const teacherSubject = useSelector((state) => state.teacherSubject.value)
  
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
  
    const handleApplyFilter = () => {
      console.log('Selected Date:', date)
      console.log('Selected Course:', selectedCourse)
      console.log('Selected Subject:', selectedSubject)
      // Add logic to fetch attendance list based on selected filters
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
      </main>
    )
  }
  
  export default TeacherAttendance
  