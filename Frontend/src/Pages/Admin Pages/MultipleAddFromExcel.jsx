import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { setToastWithTimeout } from '../../Redux/Features/Toast/toastSlice';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL


const MultipleAddFromExcel = () => {
    const dispatch= useDispatch()
    const inputRef = useRef()

    const selectFile = () => {
        if (inputRef.current) inputRef.current.click();
    }
    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            // Assuming parsedData contains objects like { name, email, studentId, course }
            handleBulkUpload(parsedData);
        };
        reader.readAsArrayBuffer(file);
    }

    const handleBulkUpload = async (students) => {
        try {
            const response = await axios.post(`${apiUrl}/admin/addMultipleStudents`,
                { students },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(response)
            if (response.status === 201) {
                dispatch(setToastWithTimeout({ type: 'success', message: response.data.message }));
                
            }
        } catch (err) {
            console.log(err)
            dispatch(setToastWithTimeout({ type: 'error', message: err.response.data.message }));
        }
    };

    return (
        <>
            <button className='bg-[#37ff62] text-white p-2 rounded text-sm' onClick={selectFile}>Add Multiple</button >
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="p-2 border rounded hidden"
            />
        </>
    )
}

export default MultipleAddFromExcel
