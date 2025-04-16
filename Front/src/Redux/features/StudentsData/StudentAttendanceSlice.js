import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const StudentAttendanceSlice = createSlice({
    name: 'studentAttendance',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = StudentAttendanceSlice.actions

export default StudentAttendanceSlice.reducer