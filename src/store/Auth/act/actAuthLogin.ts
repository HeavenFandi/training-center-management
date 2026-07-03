import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

export type UserType = "ADMIN" | "TEACHER" | "STUDENT";

export type User = {
  id: number;
  username: string;
  email: string;
  userType: UserType;
  message: string;
  token?: string;
  tenantId?: number;
  studentId?: number;
  teacherId?: number;
  [key: string]: any; 
};

export type LoginPayload = {
  email: string;
  password: string;
};

const actAuthLogin = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>("auth/actAuthLogin", async (data, thunkAPI) => {
  try {
    const loginData = {
      email: data.email.trim(),
      password: data.password,
    };

    const response = await axiosClient.post<User>("/auth/login", loginData);
    
    const userData = response.data;
 
    const userId = userData.id;

    // If token is in response, save it
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    // If user is a student, fetch all students and find the matching one
    if (userData.userType === "STUDENT") {
      try {
        const studentsResponse = await axiosClient.get("/students");

        // Process students array, handling nested data
        let students: any[] = [];
        if (studentsResponse.data && Array.isArray(studentsResponse.data)) {
          students = studentsResponse.data;
        } else if (
          studentsResponse.data &&
          "data" in studentsResponse.data &&
          Array.isArray(studentsResponse.data.data)
        ) {
          students = studentsResponse.data.data;
        }

        // Find matching student exactly: student.userId === login userId
        const matchedStudent = students.find((student: any) => {
          const matches = student.userId === userId;
          return matches;
        });

        if (matchedStudent) {
          const studentId = matchedStudent.id;
          userData.studentId = studentId;
          // Attach student data (including image) to user
          userData.student = matchedStudent;
          userData.image = matchedStudent.image;
        }
      } catch (studentErr) {
        // Error fetching students
      }
    }

    // Clear existing auth data first to avoid stale data
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("studentId");
    localStorage.removeItem("userId");

    // Save user info and user type to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", userData.userType);
    localStorage.setItem("userId", String(userId));
    if (userData.studentId) {
      localStorage.setItem("studentId", String(userData.studentId));
    }

    return userData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverData = error.response?.data;

      const apiMessage =
        typeof serverData === "string"
          ? serverData
          : serverData?.message || serverData?.error || "";

      const message = apiMessage.toLowerCase();

      if (
        status === 404 ||
        message.includes("not found") ||
        message.includes("email")
      ) {
        return thunkAPI.rejectWithValue("الإيميل غير صحيح أو غير موجود");
      }

      if (
        status === 400 ||
        status === 401 ||
        message.includes("password") ||
        message.includes("credential") ||
        message.includes("unauthorized")
      ) {
        return thunkAPI.rejectWithValue("كلمة المرور غير صحيحة");
      }

      if (status && status >= 500) {
        return thunkAPI.rejectWithValue("حدث خطأ في السيرفر  ");
      }

      if (!error.response) {
        return thunkAPI.rejectWithValue(
          "خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.",
        );
      }

      return thunkAPI.rejectWithValue(apiMessage || "فشل تسجيل الدخول");
    }

    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actAuthLogin;
