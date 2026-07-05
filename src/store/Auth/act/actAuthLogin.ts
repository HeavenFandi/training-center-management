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
  if (import.meta.env.DEV) {
    console.log("📧 Login attempt with data:", { email: data.email });
  }

  try {
    const loginData = {
      email: data.email.trim(),
      password: data.password,
    };

    const response = await axiosClient.post<User>("/auth/login", loginData);

    if (import.meta.env.DEV) {
      console.log("✅ /auth/login response:", response);
    }

    let userData = response.data;

    const userId = userData.id;

    if (
      userData.email === "admin@trainingcenter.com" ||
      userData.username === "admin"
    ) {
      userData = {
        ...userData,
        userType: "ADMIN",
        teacherId: undefined,
      };
    }

    // If user is a student, fetch all students and find the matching one
    if (userData.userType === "STUDENT") {
      try {
        const studentsResponse = await axiosClient.get("/students");

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

        const matchedStudent = students.find((student: any) => {
          return student.userId === userId;
        });

        if (matchedStudent) {
          const studentId = matchedStudent.id;
          userData.studentId = studentId;
          userData.student = matchedStudent;
          userData.image = matchedStudent.image;
        }
      } catch (studentErr) {
        if (import.meta.env.DEV) {
          console.error(
            "⚠️ Error fetching student data (proceeding):",
            studentErr,
          );
        }
      }
    }

    if (import.meta.env.DEV) {
      console.log("🎉 Returning user data from actAuthLogin:", userData);
    }

    return userData;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ actAuthLogin error:", error);
    }
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
