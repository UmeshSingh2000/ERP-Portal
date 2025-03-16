import { configureStore } from '@reduxjs/toolkit'
import teacherStudentReducer from './features/students(teachers)/teacherStudentsSlice'
export const store = configureStore({
  reducer: {
    teachersStudents: teacherStudentReducer
  },
})