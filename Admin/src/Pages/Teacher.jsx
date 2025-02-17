import React, { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import CustomTable from '@/components/customTable'
import { useDispatch, useSelector } from 'react-redux'
import { setData } from '@/ReduxStore/Features/Teachers/teacherSlices'
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL

const Teacher = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState([])
    const teacherData = useSelector((state) => state.teachers.value)
    const [duplicateTeacherData, setDuplicateTeacherData] = useState(teacherData)
    /**
     * @function fetchData
     * @returns fetch teacher data from db
     * @description This function fetch teacher data from db and set data to redux
     */
    const fetchData = useCallback(async () => {
        setSelectedTeacher([])
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/admin/getTeachers`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(setData(response.data.teachers))
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    })
    /**
     * @description when teacherData changes set duplicateTeacherData to teacherData
     */
    useEffect(() => {
        setDuplicateTeacherData(teacherData);
    }, [teacherData]);

    /**
     * @description when teacherData length is greater than 0 then fetchData from db
     */
    useEffect(() => {
        if (teacherData.length > 0) return
        fetchData()
    }, [dispatch, teacherData.length])
    return (
        <>
            <main className='px-6 h-screen flex flex-col'>
                <header className="flex flex-col gap-4 p-6  md:p-10">
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
                <section className=' overflow-y-auto flex-1'>
                    <CustomTable data = {duplicateTeacherData}/>
                </section>
            </main>
        </>
    )
}

export default Teacher
