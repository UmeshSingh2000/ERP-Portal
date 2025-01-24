import React, { useCallback, useEffect, useState } from 'react'
import AddTeacher from './AddTeacher'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setData } from '../../Redux/Features/Teachers/teachersSlice'
import Loader from '../../Componenets/Loader'
const apiUrl = import.meta.env.VITE_API_URL
const Teacher = () => {
    const [addTeacherToggle, setAddTeacherToggle] = useState(false)
    const [search, setSearch] = useState('')
    const teacherData = useSelector((state) => state.teachers.value) // teacher data stores in redux
    const [duplicateTeacherData, setDuplicateTeacherData] = useState(teacherData)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    //fetch teacher data
    const fetchData = useCallback(async () => {
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

    //search teacher
    const handleSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        if (value.trim().toLowerCase() === '') {
            setDuplicateTeacherData(teacherData);
            return;
        }
        const filteredData = teacherData.filter((teacher) => {
            return teacher.name.toLowerCase().includes(value.trim().toLowerCase())
        })
        setDuplicateTeacherData(filteredData)
    }



    useEffect(() => {
        setDuplicateTeacherData(teacherData);
    }, [teacherData]);

    useEffect(() => {
        if (teacherData.length > 0) return
        fetchData()
    }, [dispatch, teacherData.length])
    return (
        <>
            <nav>
                <header className='flex justify-between items-center p-2'>
                    <h1 className='font-bold'>Teachers</h1>
                    <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm' onClick={() => setAddTeacherToggle(!addTeacherToggle)}>Add Teacher</button>
                </header>
                <footer className='w-full md:w-1/2'>
                    <div className='relative w-full'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                        <div className='flex items-center gap-2'>
                            <input type="text" placeholder='Search Teacher' className='border-[#D4D4D4] border rounded-md w-full p-2 px-7 text-sm' value={search} onChange={handleSearch} />
                            <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm' onClick={handleSearch}>Search</button>
                            <button className='p-2 bg-red-500 rounded text-white' onClick={fetchData}>Refresh</button>
                        </div>
                    </div>
                </footer>
            </nav>
            {addTeacherToggle && <div className='absolute w-4/5 h-3/5 overflow-auto scrollbar-thin md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <AddTeacher toggleState={addTeacherToggle} onClick={setAddTeacherToggle} />
            </div>}
            <main className='pt-3 h-full overflow-auto scrollbar-thin'>
                <table className='w-full'>
                    <thead className='bg-[#EFEFEF] h-10 border-[#D4D4D4] border'>
                        <tr className='text-left'>
                            <th>Teacher Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subjects</th>
                            <th>Course</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {loading ? <Loader /> :
                        <tbody>
                            {duplicateTeacherData.length > 0 ? duplicateTeacherData.map((teacher, index) => {
                                return <tr key={index} className='border-[#D4D4D4] border h-10'>
                                    <td>{teacher.teacherId}</td>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>
                                        <select className='w-1/2 text-sm'>
                                            {teacher.subjects.map((subject, index) => {
                                                return <option className='' key={index} value={subject}>{subject}</option>
                                            })}
                                        </select></td>
                                    <td>{teacher.course}</td>
                                    <td><i className="fa-solid fa-trash cursor-pointer text-red-600"></i></td>
                                </tr>
                            }) : <tr className='border-[#D4D4D4] border h-10'>
                                <td className='text-center' colSpan='6'>No Data Found</td>
                            </tr>}
                        </tbody>
                    }
                </table>
            </main>
        </>
    )
}

export default Teacher
