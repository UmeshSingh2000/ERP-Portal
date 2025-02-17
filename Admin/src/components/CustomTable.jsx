import React, { memo, useEffect, useRef, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


import { Button } from './ui/button'
import Loader from './Loader/Loader'

const PAGE_SIZE = 10

const CustomTable = React.memo(({ data = [] }) => {
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const [paginatedData, setPaginatedData] = useState([])
    useEffect(() => {
        setPaginatedData(data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
    }, [currentPage, data]);

    if (!data || data.length === 0) return <div className='h-screen w-full flex justify-center items-center'><Loader /></div>
    return (
        <>
            <div className="">
                <Pagination className='flex justify-end sticky bg-white z-10 top-0'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} `} onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    setLoading(true)
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 500)
                                }
                            }} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink>{currentPage} of {totalPages}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} `} onClick={() => {
                                if (currentPage < totalPages) {
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    setLoading(true)
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 500)
                                }
                            }} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                {loading ? <div className='absolute top-1/2 left-1/2'><Loader /></div> : <Table className="w-full min-w-[600px]">
                    <TableCaption>A list of your Enrolled Teachers</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Sno:</TableHead>
                            <TableHead className="w-[100px]">Teacher ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-left">Subjects</TableHead>
                            <TableHead className="text-left">Course</TableHead>
                            <TableHead className="text-left">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 && paginatedData.map((teacher, index) => {
                            return <TableRow key={teacher._id}>
                                <TableCell className="font-medium"><input type="checkbox" className='mr-2 ml-1' />{((currentPage-1)*PAGE_SIZE)+index + 1}</TableCell>
                                <TableCell className="font-medium">{teacher.teacherId}</TableCell>
                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                <TableCell className="font-medium">{teacher.email}</TableCell>
                                <TableCell className="font-medium">
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Subjects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teacher.subjects.map((subject, index) => {
                                                return <SelectItem value={subject} key={index}>{subject}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="font-medium">{teacher.course}</TableCell>
                                <TableCell className="font-medium"><Button className="cursor-pointer">Delete</Button></TableCell>
                            </TableRow>
                        })}

                    </TableBody>
                </Table>
                }

            </div>
        </>
    )
})

export default CustomTable
