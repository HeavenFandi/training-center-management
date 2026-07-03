import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { Student } from "../../../types/studentDashboard";
import { RootState } from "../../index";

const actFetchProfile = createAsyncThunk<
  Student,
  number,
  { rejectValue: string }
>("studentProfile/actFetchProfile", async (studentId, thunkAPI) => {
  try {
    const response = await axiosClient.get(`/students/${studentId}`);
    
    // Handle common nested data patterns: { data: ... } or { success: true, data: ... }
    let studentData: Student;
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data) {
        studentData = response.data.data;
      } else {
        studentData = response.data;
      }
    } else {
      studentData = response.data;
    }
    
    // If bio is missing but interest exists, use interest for bio
    if (!studentData.bio && studentData.interest) {
      studentData.bio = studentData.interest;
    }
    return studentData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحميل بيانات الملف الشخصي";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchProfile;
