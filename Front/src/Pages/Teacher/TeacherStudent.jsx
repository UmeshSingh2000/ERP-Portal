import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Delete } from 'lucide-react';
import React, { useState } from 'react'

const TeacherStudent = () => {
    const [search, setSearch] = useState('')
    const handleSearch = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setSearch(value);
    };
    return (
        <main className='px-4 md:px-6 h-screen flex flex-col'>
            <header className="flex flex-col gap-4 p-4 md:p-6 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Students</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">List of Students Under You!</p>
            </header>
            <section className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                {/* Search and Refresh */}
                <div className="flex w-full md:w-3/4 lg:w-1/2 gap-2 flex-wrap">
                    <Input
                        value={search}
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search..."
                        className="flex-1 min-w-[200px] md:w-52"
                    />
                    <Button className="cursor-pointer" >Refresh</Button>
                    <Button className={`cursor-pointer bg-red-500`}><Delete /></Button>
                </div>
            </section>
        </main>
    )
}

export default TeacherStudent
