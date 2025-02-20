import { configureStore } from '@reduxjs/toolkit'
import teachersReducer from './Features/Teachers/teacherSlices'
import themeReducer from './Features/Theme/themeSlices'
export const store = configureStore({
  reducer: {
    teachers : teachersReducer,
    theme : themeReducer
  },
})