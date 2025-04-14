import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const subjectWiseStudentsSlice = createSlice({
    name: 'teachersSubjectsWiseStudents',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = subjectWiseStudentsSlice.actions

export default subjectWiseStudentsSlice.reducer