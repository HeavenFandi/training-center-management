import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { Student } from "../../../types/studentDashboard";

export interface UpdateProfileImagePayload {
  studentId: number;
  imageFile: File;
}

const actUpdateProfileImage = createAsyncThunk<
  Student,
  UpdateProfileImagePayload,
  { rejectValue: string }
>("studentProfile/actUpdateProfileImage", async ({ studentId, imageFile }, thunkAPI) => {
  try {
    console.log("[DEBUG actUpdateProfileImage] Starting profile image update for student id:", studentId);
    console.log("[DEBUG actUpdateProfileImage] Uploading file:", imageFile.name);

    const formData = new FormData();
    formData.append('file', imageFile);

    // Debug log FormData entries
    console.log("[DEBUG actUpdateProfileImage] === FormData entries before submit ===");
    for (const pair of formData.entries()) {
      console.log("[UPDATE PROFILE IMAGE FORMDATA]", pair[0], pair[1]);
    }

    const response = await axiosClient.put(`/students/${studentId}/profile-image`, formData);

    console.log("[DEBUG actUpdateProfileImage] Full response:", response);
    console.log("[DEBUG actUpdateProfileImage] Response.data:", response.data);

    // Handle common nested data patterns
    let studentData: Student;
    if (response.data && typeof response.data === "object") {
      if ("data" in response.data) {
        studentData = response.data.data;
        console.log("[DEBUG actUpdateProfileImage] Extracted nested data from response.data.data:", studentData);
      } else {
        studentData = response.data;
      }
    } else {
      studentData = response.data;
    }

    // If bio is missing but interest exists, use interest for bio
    if (!studentData.bio && studentData.interest) {
      console.log("[DEBUG actUpdateProfileImage] Using interest as bio since bio not present");
      studentData.bio = studentData.interest;
    }
    console.log("[DEBUG actUpdateProfileImage] Returning updated student data:", studentData);
    console.log("[DEBUG actUpdateProfileImage] Returning studentData.bio:", studentData?.bio);
    return studentData;
  } catch (error) {
    console.error("[DEBUG actUpdateProfileImage] === ERROR ===");
    console.error("[DEBUG actUpdateProfileImage] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actUpdateProfileImage] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحديث صورة الملف الشخصي";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actUpdateProfileImage;
