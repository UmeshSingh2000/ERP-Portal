import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from './ui/button'
const CustomTable = () => {
    return (
        <>
            <div className="w-full h-96 overflow-x-scroll">
                <Table className="w-full min-w-[600px]">
                    <TableCaption>A list of your Enrolled Teachers</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Teacher ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Subjects</TableHead>
                            <TableHead className="text-right">Course</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        
                    <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">TCA2363155</TableCell>
                            <TableCell>UMESH SINGH MEHTA</TableCell>
                            <TableCell>umeshsinghmehta4@gmail.com</TableCell>
                            <TableCell className="text-right">DSA</TableCell>
                            <TableCell className="text-right">MCA</TableCell>
                            <TableCell className="text-right">
                                <Button className="text-red-500">Delete</Button>
                            </TableCell>
                        </TableRow>
                        
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default CustomTable
