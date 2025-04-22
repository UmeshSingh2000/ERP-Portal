import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const leavesSlice = createSlice({
    name: 'leaves',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload
        }
    },
})


export const { setData } = leavesSlice.actions

export default leavesSlice.reducer