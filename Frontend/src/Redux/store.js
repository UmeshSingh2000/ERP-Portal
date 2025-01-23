import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './Features/Toast/toastSlice'
import teachersReducer from './Features/Teachers/teachersSlice'
export const store = configureStore({
  reducer: {
    toast : toastReducer,
    teachers : teachersReducer
  },
})