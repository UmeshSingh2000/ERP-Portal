import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const coordinatorsSlice = createSlice({
    name: 'coordinators',
    initialState,
    reducers: {
        setData : (state,action)=>{
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setData } = coordinatorsSlice.actions

export default coordinatorsSlice.reducer