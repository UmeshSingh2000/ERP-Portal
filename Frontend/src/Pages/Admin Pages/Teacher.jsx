import React, { useCallback, useEffect, useState } from 'react'
import AddTeacher from './AddTeacher'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setData } from '../../Redux/Features/Teachers/teachersSlice'
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice'
import Loader from '../../Componenets/Loader'
import Edit from './Edit'
const apiUrl = import.meta.env.VITE_API_URL
const Teacher = () => {
    const [editTeacherToggle, setEditTeacherToggle] = useState(false) // edit teacher button toggle state
    const [editTeacher, setEditTeacher] = useState({}) // edit teacher data
    const [addTeacherToggle, setAddTeacherToggle] = useState(false) // add teacher button toggle state
    const [selectedTeacher, setSelectedTeacher] = useState([]) // selected teacher for multiple deletion
    const [search, setSearch] = useState('') // search value
    const teacherData = useSelector((state) => state.teachers.value) // teacher data stores in redux
    const [duplicateTeacherData, setDuplicateTeacherData] = useState(teacherData) // duplicate teacher data for search 
    const [loading, setLoading] = useState(false) // loading state
    const dispatch = useDispatch() // dispatch function for dispatching action to redux

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
     * @function handleSearch
     * @param {object} e 
     * @returns set search value and filter teacher data default det to teacherData(full data) from db
     * @description This function search teacher by name and filter teacher data
     */
    const handleSearch = (e) => {
        const value = e.target.value.trim().toLowerCase()
        setSearch(value)
        if (value === '') {
            setDuplicateTeacherData(teacherData);
            return;
        }
        const filteredData = teacherData.filter(({name,email,teacherId,course}) => {
            return name.includes(value) || email.includes(value) || teacherId.toLowerCase().includes(value)
            || course.toLowerCase().includes(value)
        })
        setDuplicateTeacherData(filteredData)
    }


    /**
     * @function handleDelete
     * @param {string} teacherId 
     * @param {*string} name 
     * @description This function delete teacher by teacherId 
     */

    const handleDelete = async (teacherId, name) => {
        const confirm = window.confirm(`Are you sure you want to delete this teacher : ${name}?`)
        if (!confirm) return
        try {
            const response = await axios.delete(`${apiUrl}/admin/deleteTeacher/${teacherId}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }))
            }
        }
        catch (err) {
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }))
        }
    }

    /**
     * @function handleSelect
     * @param {string} teacherId 
     * @description This function select teacher for multiple deletion and add the selected teacher to selectedTeacher array
     */
    const handleSelect = (teacherId) => {
        if (selectedTeacher.includes(teacherId)) return setSelectedTeacher(selectedTeacher.filter((id) => id !== teacherId))
        setSelectedTeacher([...selectedTeacher, teacherId])
    }

    /**
     * @function isExist
     * @param {string} teacherId 
     * @returns boolean
     * @description This function check the teacher is exist in selectedTeacher array
     */
    const isExist = (teacherId) => {
        return selectedTeacher.includes(teacherId)
    }

    /**
     * @function handleDeleteMultiple
     * @description This function delete multiple teacher by teacherId require the id to be send as string seperated by comma which will be converted to array in the backend as db only accept array for multiple deletion
     */
    const handleDeleteMultiple = async () => {
        const confirm = window.confirm(`Are you sure you want to delete teachers?`)
        if (!confirm) return
        const teacherIds = selectedTeacher.join(',')
        try {
            const response = await axios.delete(`${apiUrl}/admin/delete-multipleTeacher/${teacherIds}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }))
                fetchData()
            }
        } catch (err) {
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }))
        }
    }

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
            <nav>
                <header className='flex justify-between items-center p-2'>
                    <h1 className='font-bold text-3xl'>Teachers</h1>
                    <button className='bg-[#3E3CCC] text-white p-2 rounded text-sm' onClick={() => {
                        setEditTeacherToggle(false)
                        setAddTeacherToggle(!addTeacherToggle)
                    }}>Add Teacher</button>
                </header>
                <footer className='w-full md:w-1/2'>
                    <div className='relative w-full'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                        <div className='flex items-center gap-2'>
                            <input type="text" placeholder='Search Teacher' className='border-[#D4D4D4] border rounded-md w-full p-2 px-9 text-sm' value={search} onChange={handleSearch} />
                            <button className='p-2 bg-[#3E3CCC] rounded text-white' onClick={fetchData}>Refresh</button>
                            <button className={`${selectedTeacher.length > 1 ? 'block' : 'hidden'} p-2 bg-red-500 rounded text-white`} onClick={handleDeleteMultiple}>Delete</button>
                        </div>
                    </div>
                </footer>
            </nav>
            {addTeacherToggle && <div className='absolute w-4/5 h-3/4 overflow-auto shadow-xl scrollbar-thin md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <AddTeacher toggleState={addTeacherToggle} onClick={setAddTeacherToggle} />
            </div>}
            {/**edit teacher panel */}
            {editTeacherToggle && <div className='absolute w-4/5 h-3/4 overflow-auto shadow-xl scrollbar-thin md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'><Edit toggleState={editTeacherToggle} onClick={setEditTeacherToggle} teacherData={editTeacher} /></div>}
            <main className='pt-3 h-full overflow-auto scrollbar-thin'>
                <table className='w-full'>
                    <thead className='bg-[#EFEFEF] h-10 border-[#D4D4D4] border'>
                        <tr className='text-left'>
                            <th>Sno:</th>
                            <th>Teacher Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subjects</th>
                            <th>Course</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Loader /></div> :
                        <tbody>
                            {duplicateTeacherData.length > 0 ? duplicateTeacherData.map((teacher, index) => {
                                return <tr key={index} className={`${isExist(teacher._id) ? 'bg-[#EFEFEF] shadow-md' : 'bg-transparent'} border-[#D4D4D4] border h-10 transition-all duration-200`}>
                                    <td><input type="checkbox" className='mr-2 ml-1' onClick={() => handleSelect(teacher._id)} />{index + 1}</td>
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
                                    <td><i className="fa-solid fa-trash  ml-3 mr-3 cursor-pointer text-red-600" onClick={() => handleDelete(teacher._id, teacher.name)}></i><i className="fa-regular fa-pen-to-square cursor-pointer" onClick={() => {
                                        setAddTeacherToggle(false)
                                        setEditTeacherToggle(!editTeacherToggle)
                                        setEditTeacher(teacher)
                                    }}></i></td>
                                </tr>
                            }) : <tr className='border-[#D4D4D4] border h-10'>
                                <td className='text-center' colSpan='8'>No Data Found</td>
                            </tr>}
                        </tbody>
                    }
                </table>
            </main>
        </>
    )
}

export default Teacher
