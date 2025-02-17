import { configureStore } from '@reduxjs/toolkit'
import teachersReducer from './Features/Teachers/teacherSlices'
export const store = configureStore({
  reducer: {
    teachers : teachersReducer,
  },
})