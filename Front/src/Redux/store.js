import { configureStore } from '@reduxjs/toolkit'
import teacherStudentReducer from './features/students(teachers)/teacherStudentsSlice'
import teacherCourseReducer from './features/TeachersData/teacherCourseSlice'
import teacherSubjectReducer from './features/TeachersData/teacherSubjectSlice'
import teachersCourseWiseStudentsReducer from './features/students(teachers)/courseWiseStudentsSlice'
import teachersSubjectWiseStudentsReducer from './features/students(teachers)/subjectWiseStudentsSlice'
import studentAttendanceReducer from './features/StudentsData/StudentAttendanceSlice'
import themeReducer from './features/Theme/themeSlices'
import leavesReducer from './features/Leaves/leavesSlice'
export const store = configureStore({
  reducer: {
    teachersStudents: teacherStudentReducer,
    theme: themeReducer,
    teacherCourse: teacherCourseReducer,
    teacherSubject: teacherSubjectReducer,
    teachersCourseWiseStudentNumber: teachersCourseWiseStudentsReducer,
    teacherSubjectWiseStudentNumber: teachersSubjectWiseStudentsReducer,
    studentAttendance: studentAttendanceReducer,
    leaves : leavesReducer
  },
})