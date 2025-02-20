import StudentsPerCourseChart from '@/components/StudentsPerCourseChart'
import StudentTeacherChart from '@/components/StudentTeacherChart'
import React from 'react'

const Home = () => {
  return (
    <>
      <main>
        <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">View, add, and manage teacher profiles and their assigned classes.</p>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <StudentsPerCourseChart />
          <StudentTeacherChart />
        </section>
      </main>
    </>
  )
}

export default Home
