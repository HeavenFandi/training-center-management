import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { ActiveCourse } from "../../../types/studentDashboard";

const actFetchActiveStudentCourses = createAsyncThunk<
  ActiveCourse[],
  number,
  { rejectValue: string }
>("studentProfile/actFetchActiveStudentCourses", async (studentId, thunkAPI) => {
  try {
    console.log("[DEBUG actFetchActiveStudentCourses] Fetching active courses for student id:", studentId);
    const url = `/enrollments/student/${studentId}/active`;
    console.log("[DEBUG actFetchActiveStudentCourses] Request URL:", url);
    const response = await axiosClient.get(url);
    console.log("[DEBUG actFetchActiveStudentCourses] Response data:", response.data);

    // Handle possible response formats
    let courses: ActiveCourse[];
    if (Array.isArray(response.data)) {
      courses = response.data;
    } else if (typeof response.data === "object" && response.data !== null) {
      if ("data" in response.data && Array.isArray(response.data.data)) {
        courses = response.data.data;
      } else if ("courses" in response.data && Array.isArray(response.data.courses)) {
        courses = response.data.courses;
      } else {
        courses = [];
      }
    } else {
      courses = [];
    }

    console.log("[DEBUG actFetchActiveStudentCourses] Processed courses:", courses);
    return courses;
  } catch (error) {
    console.error("[DEBUG actFetchActiveStudentCourses] === ERROR ===");
    console.error("[DEBUG actFetchActiveStudentCourses] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actFetchActiveStudentCourses] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحميل الدورات النشطة";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchActiveStudentCourses;
