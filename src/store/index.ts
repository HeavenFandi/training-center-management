import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import trainingSessionsReducer from "./Courses/trainingSessionsSlice";
import coursesReducer from "./Courses/courseSlice";
import studentProfileReducer from "./StudentProfile/studentProfileSlice";
import otpReducer from "./OTP/otpSlice";
import institutesReducer from "./Institutes/institutesSlice";
import studentsReducer from "./Students/studentsSlice";
import teachersReducer from "./teachers/teachersSlice";
import classroomsReducer from "./Classrooms/classroomsSlice";
import quizzesReducer from "./Quizzez/quizzesSlice";
import gradesReducer from "./Grades/gradesSlice";
import attendanceReducer from "./Attendance/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainingSessions: trainingSessionsReducer,
    courses: coursesReducer,
    quizzes: quizzesReducer,
    studentProfile: studentProfileReducer,
    otp: otpReducer,
    institutes: institutesReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    classrooms: classroomsReducer,
    grades: gradesReducer,
    attendance: attendanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
