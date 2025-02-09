import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './Features/Toast/toastSlice'
import teachersReducer from './Features/Teachers/teachersSlice'
import studentReducer from './Features/Students/studentsSlice'
export const store = configureStore({
  reducer: {
    toast : toastReducer,
    teachers : teachersReducer,
    students : studentReducer
  },
})