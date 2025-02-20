import React, { useRef } from 'react'

import * as XLSX from 'xlsx';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import toastHelper from '@/Helpers/toastHelper';
import { Button } from './ui/button';
import { FileJson } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
const apiUrl = import.meta.env.VITE_API_URL


const MultipleAddFromExcel = () => {
    const inputRef = useRef()
    const { toast } = useToast()

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

    const handleBulkUpload = async (teachers) => {
        try {
            const response = await axios.post(`${apiUrl}/admin/addMultipleTeachers`,
                { teachers },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.status === 201) {
                toastHelper(toast, response.data.message, 'Success')

            }
        } catch (err) {
            console.log(err)
            toastHelper(toast, err.response.data.message, 'Error', 2000, "destructive")
        }
    };

    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <Button className="cursor-pointer bg-green-500" onClick={selectFile}><FileJson /></Button>
                </HoverCardTrigger>
                <HoverCardContent>
                    Add Multiple Teacher at Once Just Drop Excel File
                </HoverCardContent>
            </HoverCard>
            {/* <button className='bg-[#37ff62] text-white p-2 rounded text-sm' onClick={selectFile}>Add Multiple</button > */}
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
