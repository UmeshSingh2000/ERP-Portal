import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setData } from '../../Redux/Features/Students/studentsSlice'
import Loader from '../../Componenets/Loader'
import AddTeacher from './AddTeacher'
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice'
import MultipleAddFromExcel from './MultipleAddFromExcel'
import Edit from './Edit'
const apiUrl = import.meta.env.VITE_API_URL
const Students = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [editStudentToogle,setEditStudentToogle]=useState(false)
    const [editStudent,setEditStudent] = useState({})
    const studentData = useSelector((state) => state.students.value || null)
    const [duplicateStudentData, setDuplicateStudentData] = useState(studentData)
    const [addStudentToggle, setStudentToggle] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedStudent, setSelectedStudent] = useState([])
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/admin/getStudents`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(setData(response.data.students))
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
     * @returns set search value and filter student data default set to studentData(full data) from db
     * @description This function search student by name and filter student data
     */
    const handleSearch = (e) => {
        const value = e.target.value.trim().toLowerCase()
        setSearch(value)
        if (value === '') {
            setDuplicateStudentData(studentData);
            return;
        }
        const filteredData = studentData.filter(({ name, email, studentId, course }) => {
            return (name.toLowerCase().includes(value) ||
                email.toLowerCase().includes(value) ||
                studentId.toLowerCase().includes(value) ||
                course.toLowerCase().includes(value)
            )
        })
        setDuplicateStudentData(filteredData)
    }


    /**
     * @function handleDelete
     * @param {string} studentId 
     * @param {*string} name 
     * @description This function delete student by studentId 
     */

    const handleDelete = async (studentId, name) => {
        const confirm = window.confirm(`Are you sure you want to delete this student : ${name}?`)
        if (!confirm) return
        try {
            const response = await axios.delete(`${apiUrl}/admin/deleteStudent/${studentId}`, {
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
     * @function handleDeleteMultiple
     * @description This function delete multiple student by studentId require the id to be send as string seperated by comma which will be converted to array in the backend as db only accept array for multiple deletion
     */

    const handleDeleteMultiple = async () => {
        const confirm = window.confirm(`Are you sure you want to delete teachers?`)
        if (!confirm) return;
        const studentIds = selectedStudent.join(',')
        try {
            const response = await axios.delete(`${apiUrl}/admin/delete-multipleStudent/${studentIds}`, {
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
     * @function handleSelect
     * @param {string} studentId 
     * @description This function select student for multiple deletion and add the selected student to selectedstudent array
     */

    const handleSelect = (studentId) => {
        if (selectedStudent.includes(studentId)) return setSelectedStudent(selectedStudent.filter((id) => id !== studentId))
        setSelectedStudent([...selectedStudent, studentId])
    }


    /**
     * @function isExist
     * @param {string} studentId 
     * @returns boolean
     * @description This function check the student is exist in selectedStudent array
     */
    const isExist = (studentId) => {
        return selectedStudent.includes(studentId)
    }


    /**
     * @description when studentData changes set duplicateStudentData to studentData
     */
    useEffect(() => {
        setDuplicateStudentData(studentData)
    }, [studentData])

    /**
    * @description when studentData length is greater than 0 then fetchData from db
    */
    useEffect(() => {
        setDuplicateStudentData(studentData)
    }, [studentData])


    useEffect(() => {
        if (studentData.length > 0) return
        fetchData()
    }, [dispatch, studentData.length])
    return (
        <>
            <nav>
                <header className='flex justify-between items-center p-2'>
                    <h1 className='font-bold text-3xl'>Students</h1>
                    <div className='flex gap-2'>
                        <button className='bg-[#212121] text-white p-2 rounded text-sm' onClick={() => setStudentToggle(!addStudentToggle)}>Add Student</button>
                        <MultipleAddFromExcel />
                    </div>
                </header>
                <footer className='w-full md:w-1/2'>
                    <div className='relative w-full'>
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 left-[2%]"></i>
                        <div className='flex items-center gap-2'>
                            <input type="text" placeholder='Search Students' className='border-[#D4D4D4] border rounded-md w-full p-2 px-9 text-sm' value={search} onChange={handleSearch} />
                            <button className='p-2 bg-[#212121] rounded text-white' onClick={fetchData}>Refresh</button>
                            <button className={`${selectedStudent.length > 1 ? 'block' : 'hidden'} p-2 bg-red-500 rounded text-white`} onClick={handleDeleteMultiple}>Delete</button>
                        </div>
                    </div>
                </footer>
            </nav>
            {addStudentToggle && <div className='absolute w-4/5 h-3/4 overflow-auto shadow-xl scrollbar-thin md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <AddTeacher toggleState={addStudentToggle} title="Student" onClick={setStudentToggle} />
            </div>}
            {/**edit student panel */}
            {editStudentToogle && <div className='absolute w-4/5 h-3/4 overflow-auto shadow-xl scrollbar-thin md:w-1/3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'><Edit title="Student" toggleState={editStudentToogle} onClick={setEditStudentToogle} teacherData={editStudent} /></div>}
            <main className='pt-3 h-full overflow-auto scrollbar-thin'>
                <table className='w-full'>
                    <thead className='bg-[#EFEFEF] h-10 border-[#D4D4D4] border'>
                        <tr className='text-left'>
                            <th>Sno:</th>
                            <th>Student Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subjects</th>
                            <th>Course</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Loader /></div> :
                        <tbody>
                            {duplicateStudentData.length > 0 ? duplicateStudentData.map((student, index) => {
                                return <tr key={index} className={`${isExist(student._id) ? 'bg-[#EFEFEF] shadow-md' : 'bg-transparent'} border-[#D4D4D4] border h-10 transition-all duration-200`}>
                                    <td><input type="checkbox" className='mr-2 ml-1' onClick={() => handleSelect(student._id)} />{index + 1}</td>
                                    <td>{student.studentId}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <select className='w-1/2 text-sm'>
                                            {student.subjects.map((subject, index) => {
                                                return <option className='' key={index} value={subject}>{subject}</option>
                                            })}
                                        </select></td>
                                    <td>{student.course}</td>
                                    <td><i className="fa-solid fa-trash  ml-3 mr-3 cursor-pointer text-red-600" onClick={() => handleDelete(student._id, student.name)}></i><i className="fa-regular fa-pen-to-square cursor-pointer" onClick={()=>{
                                        setStudentToggle(false)
                                        setEditStudentToogle(!editStudentToogle)
                                        setEditStudent(student)
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

export default Students
