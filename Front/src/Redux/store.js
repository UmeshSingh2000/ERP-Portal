import { configureStore } from '@reduxjs/toolkit'
import teacherStudentReducer from './features/students(teachers)/teacherStudentsSlice'
import teacherCourseReducer from './features/TeachersData/teacherCourseSlice'
import teacherSubjectReducer from './features/TeachersData/teacherSubjectSlice'
import teachersCourseWiseStudentsReducer from './features/students(teachers)/courseWiseStudentsSlice'
import teachersSubjectWiseStudentsReducer from './features/students(teachers)/subjectWiseStudentsSlice'
import themeReducer from './features/Theme/themeSlices'
export const store = configureStore({
  reducer: {
    teachersStudents: teacherStudentReducer,
    theme: themeReducer,
    teacherCourse: teacherCourseReducer,
    teacherSubject: teacherSubjectReducer,
    teachersCourseWiseStudentNumber: teachersCourseWiseStudentsReducer,
    teacherSubjectWiseStudentNumber: teachersSubjectWiseStudentsReducer,
  },
})