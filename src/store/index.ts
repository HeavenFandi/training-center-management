import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/authSlice";
import trainingSessionsReducer from "./Courses/trainingSessionsSlice";
import studentProfileReducer from "./StudentProfile/studentProfileSlice";
import otpReducer from "./OTP/otpSlice";
import institutesReducer from "./Institutes/institutesSlice";
import studentsReducer from "./Students/studentsSlice";
import teachersReducer from "./teachers/teachersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainingSessions: trainingSessionsReducer,
    studentProfile: studentProfileReducer,
    otp: otpReducer,
    institutes: institutesReducer,
    students: studentsReducer,
    teachers: teachersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
