import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const teacherSubjectSlice = createSlice({
    name: 'teacherSubject',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = teacherSubjectSlice.actions

export default teacherSubjectSlice.reducer