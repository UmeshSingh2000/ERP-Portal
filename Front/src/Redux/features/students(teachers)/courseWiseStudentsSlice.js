import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const courseWiseStudentsSlice = createSlice({
    name: 'teachersCourseWiseStudents',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = courseWiseStudentsSlice.actions

export default courseWiseStudentsSlice.reducer