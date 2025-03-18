import { configureStore } from '@reduxjs/toolkit'
import teacherStudentReducer from './features/students(teachers)/teacherStudentsSlice'
import themeReducer from './features/Theme/themeSlices'
export const store = configureStore({
  reducer: {
    teachersStudents: teacherStudentReducer,
    theme : themeReducer
  },
})