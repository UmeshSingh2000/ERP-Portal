import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setData : (state,action)=>{
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setData } = studentsSlice.actions

export default studentsSlice.reducer