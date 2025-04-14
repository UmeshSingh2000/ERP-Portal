import CoursewiseStudents from '@/components/CoursewiseStudents'
import React from 'react'

const TeacherHome = () => {
    return (
        <main>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">View,  Students profiles and their assigned classes.</p>
            </header>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                <CoursewiseStudents />
                <CoursewiseStudents />
                <CoursewiseStudents />
            </section>
        </main>
    )
}

export default TeacherHome
