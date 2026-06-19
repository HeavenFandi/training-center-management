import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const actFetchTrainingHours = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("studentProfile/actFetchTrainingHours", async (studentId, thunkAPI) => {
  try {
    console.log("[DEBUG actFetchTrainingHours] Fetching training hours for student id:", studentId);
    const response = await axiosClient.get(`/students/${studentId}/training-hours`);
    console.log("[DEBUG actFetchTrainingHours] Full response:", response);
    console.log("[DEBUG actFetchTrainingHours] Response.data:", response.data);

    // Extract the number value
    let trainingHours: number;
    if (typeof response.data === "number") {
      trainingHours = response.data;
    } else if (typeof response.data === "object" && response.data !== null) {
      if ("data" in response.data) {
        trainingHours = typeof response.data.data === "number" ? response.data.data : 0;
      } else if ("trainingHours" in response.data) {
        trainingHours = typeof response.data.trainingHours === "number" ? response.data.trainingHours : 0;
      } else {
        trainingHours = 0;
      }
    } else {
      trainingHours = 0;
    }

    console.log("[DEBUG actFetchTrainingHours] Returning training hours:", trainingHours);
    return trainingHours;
  } catch (error) {
    console.error("[DEBUG actFetchTrainingHours] === ERROR ===");
    console.error("[DEBUG actFetchTrainingHours] Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actFetchTrainingHours] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحميل ساعات التدريب";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchTrainingHours;
