import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const teacherCourseSlice = createSlice({
    name: 'teacherCourse',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = teacherCourseSlice.actions

export default teacherCourseSlice.reducer