import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './Features/Toast/toastSlice'
export const store = configureStore({
  reducer: {
    toast : toastReducer
  },
})