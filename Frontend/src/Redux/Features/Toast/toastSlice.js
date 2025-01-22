import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        type: null,
        message: null
    }
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToast: (state, action) => {
            const { type, message } = action.payload
            state.value = { type, message }
        },
        clearToast: (state) => {
            state.value = { type: null, message: null }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setToast,clearToast } = toastSlice.actions

export const setToastWithTimeout = (toast) => (dispatch) => {
    dispatch(setToast(toast));
    setTimeout(() => {
        dispatch(clearToast());
    }, 2000); // Clears toast after 5 seconds
};


export default toastSlice.reducer