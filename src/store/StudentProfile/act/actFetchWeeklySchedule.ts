import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { WeeklyScheduleItem } from "../../../types/studentDashboard";
import { RootState } from "../../index";

const actFetchWeeklySchedule = createAsyncThunk<
  WeeklyScheduleItem[],
  number,
  { rejectValue: string }
>("studentProfile/actFetchWeeklySchedule", async (studentId, thunkAPI) => {
  const { getState } = thunkAPI;
  const state = getState() as RootState;
  
  // If we already have weekly schedule data and fetch completed (loading is false), don't fetch again
  if (state.studentProfile.weeklySchedule.length > 0 && !state.studentProfile.scheduleLoading) {
    return state.studentProfile.weeklySchedule;
  }
  
  try {
    console.log("[DEBUG actFetchWeeklySchedule] Fetching weekly schedule for student id:", studentId);
    const response = await axiosClient.get(`/students/${studentId}/weekly-schedule`);
    console.log("[DEBUG actFetchWeeklySchedule] Full API response:", response);
    
    let weeklySchedule: WeeklyScheduleItem[] = [];
    if (Array.isArray(response.data)) {
      weeklySchedule = response.data;
    } else if (typeof response.data === "object" && response.data !== null) {
      if ("data" in response.data && Array.isArray(response.data.data)) {
        weeklySchedule = response.data.data;
      }
    }
    console.log("[DEBUG actFetchWeeklySchedule] Processed weeklySchedule:", weeklySchedule);

    return weeklySchedule;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actFetchWeeklySchedule] Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const apiMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error || "فشل تحميل الجدول الدراسي";
      return thunkAPI.rejectWithValue(apiMessage);
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actFetchWeeklySchedule;
