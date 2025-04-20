import { configureStore } from '@reduxjs/toolkit'
import teachersReducer from './Features/Teachers/teacherSlices'
import studentsReducer from './Features/Students/studentsSlice'
import themeReducer from './Features/Theme/themeSlices'
import subjectsReducer from './Features/Subjects/subjectSlices'
import coursesReducer from './Features/Courses/courseSlice'
import coordinatorsReducer from './Features/Coordinators/coordinatorsSlice'
export const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    theme: themeReducer,
    students: studentsReducer,
    subjects: subjectsReducer,
    courses: coursesReducer,
    coordinators : coordinatorsReducer
  },
})