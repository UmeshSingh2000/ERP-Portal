import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const teachersSlice = createSlice({
    name: 'teachers',
    initialState,
    reducers: {
        setData : (state,action)=>{
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setData } = teachersSlice.actions

export default teachersSlice.reducer