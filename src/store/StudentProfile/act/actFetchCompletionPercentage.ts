import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const actFetchCompletionPercentage = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("studentProfile/actFetchCompletionPercentage", async (studentId, thunkAPI) => {
  try {
    console.log("[DEBUG actFetchCompletionPercentage] Fetching completion percentage for student id:", studentId);
    const response = await axiosClient.get(`/students/${studentId}/completion-percentage`);
    
    let completionPercentage: number;
    if (typeof response.data === "number") {
      completionPercentage = response.data;
    } else if (typeof response.data === "object" && response.data !== null) {
      if ("data" in response.data) {
        completionPercentage = typeof response.data.data === "number" ? response.data.data : 0;
      } else if ("completionPercentage" in response.data) {
        completionPercentage = typeof response.data.completionPercentage === "number" ? response.data.completionPercentage : 0;
      } else {
        completionPercentage = 0;
      }
    } else {
      completionPercentage = 0;
    }

    return completionPercentage;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actFetchCompletionPercentage] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحميل نسبة الإكمال";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchCompletionPercentage;
