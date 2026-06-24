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
  const { getState } = thunkAPI;
  const state = getState() as RootState;
  
  // If we already have profile data and fetch completed (loading is false), don't fetch again
  if (state.studentProfile.profile && !state.studentProfile.loading) {
    return state.studentProfile.profile;
  }
  
  try {
    console.log("[DEBUG actFetchProfile] Fetching student profile with id:", studentId);
    const response = await axiosClient.get(`/students/${studentId}`);
    console.log("[DEBUG actFetchProfile] Full response:", response);
    console.log("[DEBUG actFetchProfile] Response.data:", response.data);
    console.log("[DEBUG actFetchProfile] Response.data.bio (directly):", response.data?.bio);
    
    // Handle common nested data patterns: { data: ... } or { success: true, data: ... }
    let studentData: Student;
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data) {
        studentData = response.data.data;
        console.log("[DEBUG actFetchProfile] Extracted nested data from response.data.data:", studentData);
        console.log("[DEBUG actFetchProfile] Nested data bio:", studentData?.bio);
      } else {
        studentData = response.data;
      }
    } else {
      studentData = response.data;
    }
    
    // If bio is missing but interest exists, use interest for bio
    if (!studentData.bio && studentData.interest) {
      console.log("[DEBUG actFetchProfile] Using interest as bio since bio not present");
      studentData.bio = studentData.interest;
    }
    console.log("[DEBUG actFetchProfile] Returning student data:", studentData);
    console.log("[DEBUG actFetchProfile] Returning student.bio:", studentData?.bio);
    return studentData;
  } catch (error) {
    console.error("[DEBUG actFetchProfile] Error:", error);
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
