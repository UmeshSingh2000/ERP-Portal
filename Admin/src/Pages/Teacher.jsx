import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import CustomTable from '@/components/customTable'





const Teacher = () => {
    return (
        <>
            <main className='px-6'>
                <header className="flex flex-col gap-4 p-6 md:p-10">
                    <h1 className="text-4xl font-bold">Teachers</h1>
                    <p className='text-sm text-gray-600 font-medium'>Manage Teachers</p>
                    <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
                        {/* Search and Refresh */}
                        <div className="flex w-full md:w-full lg:w-1/2 gap-2">
                            <Input type="text" id="text" placeholder="Search..." className="flex-1 md:w-52" />
                            <Button className="cursor-pointer">Refresh</Button>
                        </div>
                        {/* Buttons for adding teachers */}
                        <div className="flex w-full md:w-auto items-center gap-2 justify-end">
                            <Button className="cursor-pointer">Add Teacher</Button>
                            <Button className="cursor-pointer bg-green-500">Add Multiple Teacher</Button>
                        </div>
                    </div>
                </header>
                <section>
                    <CustomTable/>
                </section>
            </main>

        </>
    )
}

export default Teacher
