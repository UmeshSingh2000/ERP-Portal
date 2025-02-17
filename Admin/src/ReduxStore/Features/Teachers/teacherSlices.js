import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const teacherSlice = createSlice({
    name: 'teachers',
    initialState,
    reducers: {
        setData : (state,action)=>{
            state.value = action.payload
        }
    },
})


export const { setData } = teacherSlice.actions

export default teacherSlice.reducer