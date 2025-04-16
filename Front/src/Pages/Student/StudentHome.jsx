import React from 'react'
import Test from './test'

const StudentHome = () => {
  return (
    <main>
      <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 font-medium">View Your Stats!!</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
        <Test />

      </section>
    </main>
  )
}

export default StudentHome
