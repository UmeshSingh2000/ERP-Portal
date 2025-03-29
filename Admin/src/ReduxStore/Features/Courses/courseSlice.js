import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: []
}

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setData } = courseSlice.actions

export default courseSlice.reducer