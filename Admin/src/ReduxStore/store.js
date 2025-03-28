import { configureStore } from '@reduxjs/toolkit'
import teachersReducer from './Features/Teachers/teacherSlices'
import studentsReducer from './Features/Students/studentsSlice'
import themeReducer from './Features/Theme/themeSlices'
import subjectsReducer from './Features/Subjects/subjectSlices'
export const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    theme: themeReducer,
    students: studentsReducer,
    subjects: subjectsReducer
  },
})