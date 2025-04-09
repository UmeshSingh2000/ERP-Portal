import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
    myStudents: [],
}

export const teacherStudentsSlice = createSlice({
    name: 'teachersStudents',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = teacherStudentsSlice.actions

export default teacherStudentsSlice.reducer