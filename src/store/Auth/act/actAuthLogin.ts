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
    console.log("[DEBUG actAuthLogin] === START LOGIN ===");
    console.log("[DEBUG actAuthLogin] Sending Login Payload:", loginData);

    const response = await axiosClient.post<User>("/auth/login", loginData);
    
    const userData = response.data;
 
    console.log("[DEBUG actAuthLogin] Login Response (userData):", userData);
    const userId = userData.id;
    console.log("[DEBUG actAuthLogin] userId (from login):", userId);

    // Save userId in localStorage
    localStorage.setItem("userId", String(userId));
    console.log(
      "[DEBUG actAuthLogin] Saved userId to localStorage:",
      localStorage.getItem("userId"),
    );

    // If user is a student, fetch all students and find the matching one
    if (userData.userType === "STUDENT") {
      console.log(
        "[DEBUG actAuthLogin] User is STUDENT, fetching /api/students to find matching student...",
      );
      try {
        const studentsResponse = await axiosClient.get("/students");
        console.log(
          "[DEBUG actAuthLogin] Full /api/students response:",
          studentsResponse,
        );

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
        } else {
          console.error(
            "[DEBUG actAuthLogin] ❌ Students response is not an array or in expected format:",
            studentsResponse.data,
          );
        }

        console.log(
          "[DEBUG actAuthLogin] Students array (processed):",
          students,
        );
        console.log(
          "[DEBUG actAuthLogin] Looking for student with userId =",
          userId,
        );

        // Find matching student exactly: student.userId === login userId
        const matchedStudent = students.find((student: any) => {
          console.log("[DEBUG actAuthLogin] Checking student:", student);
          const matches = student.userId === userId;
          console.log(
            "[DEBUG actAuthLogin]  student.userId =",
            student.userId,
            "| matches =",
            matches,
          );
          return matches;
        });

        if (matchedStudent) {
          const studentId = matchedStudent.id;
          console.log(
            "[DEBUG actAuthLogin] ✅ FOUND MATCHING STUDENT! studentId =",
            studentId,
          );
          console.log(
            "[DEBUG actAuthLogin] Matched student full data:",
            matchedStudent,
          );
          userData.studentId = studentId;
          // Attach student data (including image) to user
          userData.student = matchedStudent;
          userData.image = matchedStudent.image;
          localStorage.setItem("studentId", String(studentId));
          // Also save updated user to localStorage (with student data)
          localStorage.setItem("user", JSON.stringify(userData));
          console.log(
            "[DEBUG actAuthLogin] ✅ Saved studentId to localStorage:",
            localStorage.getItem("studentId"),
          );
          console.log(
            "[DEBUG actAuthLogin] ✅ Updated user in localStorage with student data:",
            JSON.parse(localStorage.getItem("user") || "{}"),
          );
        } else {
          console.error(
            "[DEBUG actAuthLogin] ❌ NO MATCHING STUDENT FOUND for userId =",
            userId,
          );
          console.error(
            "[DEBUG actAuthLogin] ❌ Available students:",
            students,
          );
        }
      } catch (studentErr) {
        console.error(
          "[DEBUG actAuthLogin] ❌ Error fetching /api/students:",
          studentErr,
        );
      }
    }

    // Save user info and user type to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", userData.userType);
    console.log(
      "[DEBUG actAuthLogin] ✅ Saved user to localStorage:",
      JSON.parse(localStorage.getItem("user") || "{}"),
    );
    console.log("[DEBUG actAuthLogin] === END LOGIN (SUCCESS) ===");

    return userData;
  } catch (error) {
    console.error("[DEBUG actAuthLogin] === LOGIN FAILED ===");
    console.error("[DEBUG actAuthLogin] Login error:", error);
    if (axios.isAxiosError(error)) {
      console.error(
        "[DEBUG actAuthLogin] ❌ Server Response Data:",
        error.response?.data,
      );
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
