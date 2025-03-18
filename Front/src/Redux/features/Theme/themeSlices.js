import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    value : 'dark'
}

export const themeSlices = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme : (state)=>{
            state.value = state.value === "light" ? "dark" : "light"
        }
    },
})


export const { toggleTheme } = themeSlices.actions

export default themeSlices.reducer