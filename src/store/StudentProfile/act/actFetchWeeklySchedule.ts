import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { WeeklyScheduleItem } from "../../../types/studentDashboard";


interface FetchWeeklyScheduleArgs {
  studentId: number;
  referenceDate?: string; 
}

const actFetchWeeklySchedule = createAsyncThunk<
  WeeklyScheduleItem[],
  FetchWeeklyScheduleArgs,
  { rejectValue: string }
>("studentProfile/actFetchWeeklySchedule", async (args, thunkAPI) => {
  const { studentId, referenceDate } = args;
  
  try {

    let url = `/students/${studentId}/weekly-schedule`;
    if (referenceDate) {
      url += `?date=${encodeURIComponent(referenceDate)}`;
    }
    const response = await axiosClient.get(url);
    
    let weeklySchedule: WeeklyScheduleItem[] = [];
    if (Array.isArray(response.data)) {
      weeklySchedule = response.data;
    } else if (typeof response.data === "object" && response.data !== null) {
      if ("data" in response.data && Array.isArray(response.data.data)) {
        weeklySchedule = response.data.data;
      }
    }

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
