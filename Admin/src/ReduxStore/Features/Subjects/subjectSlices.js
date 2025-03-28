import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const subjectSlices = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setData } = subjectSlices.actions

export default subjectSlices.reducer