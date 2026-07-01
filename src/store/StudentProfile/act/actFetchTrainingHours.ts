import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { StudentTrainingHours } from "../../../types/studentDashboard";
import { RootState } from "../../index";

const actFetchTrainingHours = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("studentProfile/actFetchTrainingHours", async (studentId, thunkAPI) => {
  const { getState } = thunkAPI;
  const state = getState() as RootState;

  // If we already have training hours data and fetch completed (loading is false), don't fetch again
  if (
    state.studentProfile.trainingHours !== 0 &&
    !state.studentProfile.trainingHoursLoading
  ) {
    return state.studentProfile.trainingHours;
  }

  try {
    console.log(
      "[DEBUG actFetchTrainingHours] Fetching training hours for student id:",
      studentId,
    );
    const response = await axiosClient.get(
      `/students/${studentId}/training-hours`,
    );
    console.log("[DEBUG actFetchTrainingHours] Full response:", response);
    console.log("[DEBUG actFetchTrainingHours] Response.data:", response.data);

    const payload = response.data as Partial<StudentTrainingHours> | null;
    const trainingHours =
      typeof payload?.totalHours === "number" ? payload.totalHours : 0;

    console.log(
      "[DEBUG actFetchTrainingHours] Returning training hours:",
      trainingHours,
    );
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
          : error.response?.data?.message ||
            error.response?.data?.error ||
            "فشل تحميل ساعات التدريب";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchTrainingHours;
