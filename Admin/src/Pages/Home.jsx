import StudentsPerCourseChart from '@/components/StudentsPerCourseChart'
import StudentTeacherChart from '@/components/StudentTeacherChart'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <StudentsPerCourseChart/>
        <StudentTeacherChart />
      </div>
    </>
  )
}

export default Home
