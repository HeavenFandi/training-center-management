import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { Student } from "../../../types/studentDashboard";

export interface UpdateProfilePayload {
  studentId: number;
  profileData: Partial<Student>;
}

const actUpdateProfile = createAsyncThunk<
  Student,
  UpdateProfilePayload,
  { rejectValue: string }
>("studentProfile/actUpdateProfile", async ({ studentId, profileData }, thunkAPI) => {
  try {
    console.log("[DEBUG actUpdateProfile] === START actUpdateProfile ===");
    console.log("[DEBUG actUpdateProfile] studentId:", studentId);
    console.log("[DEBUG actUpdateProfile] profileData (original):", profileData);
    console.log("[DEBUG actUpdateProfile] profileData.bio (original):", profileData.bio);
    
    // Prepare FormData for multipart/form-data
    const formData = new FormData();
    
    // Explicitly include only the fields we want to update
    const allowedFields = [
      'firstName', 'lastName', 'username', 'gender',
      'birthDate', 'address', 'bio', 'contactInfo'
    ];
    allowedFields.forEach(field => {
      if (profileData[field as keyof Student] !== undefined && profileData[field as keyof Student] !== null) {
        const value = profileData[field as keyof Student];
        formData.append(field, String(value));
      }
    });
    console.log("[DEBUG actUpdateProfile] FormData includes bio?", formData.has('bio'));
    console.log("[DEBUG actUpdateProfile] FormData bio value:", formData.get('bio'));
    
    // Only add password if it's present and not empty
    if (profileData.password && profileData.password.trim() !== '') {
      formData.append('password', profileData.password);
    }
    
    console.log("[DEBUG actUpdateProfile] FormData entries:", Array.from(formData.entries()));
    
    const putUrl = `/students/${studentId}`;
    console.log("[DEBUG actUpdateProfile] PUT URL:", putUrl);
    
    const response = await axiosClient.put(putUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("[DEBUG actUpdateProfile] Full response:", response);
    console.log("[DEBUG actUpdateProfile] Response.data:", response.data);
    
    // Handle common nested data patterns
    let studentData: Student;
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data) {
        studentData = response.data.data;
        console.log("[DEBUG actUpdateProfile] Extracted nested data from response.data.data:", studentData);
        console.log("[DEBUG actUpdateProfile] Nested response data bio:", studentData.bio);
      } else {
        studentData = response.data;
        console.log("[DEBUG actUpdateProfile] Response data bio:", studentData.bio);
      }
    } else {
      studentData = response.data;
    }
    
    // If bio is missing but interest exists, use interest for bio
    if (!studentData.bio && studentData.interest) {
      console.log("[DEBUG actUpdateProfile] Using interest as bio since bio not present");
      studentData.bio = studentData.interest;
    }
    console.log("[DEBUG actUpdateProfile] Returning studentData:", studentData);
    console.log("[DEBUG actUpdateProfile] Returning studentData.bio:", studentData?.bio);
    return studentData;
  } catch (error) {
    console.error("[DEBUG actUpdateProfile] === ERROR ====");
    console.error("[DEBUG actUpdateProfile] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actUpdateProfile] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        }
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحديث بيانات الملف الشخصي";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actUpdateProfile;
