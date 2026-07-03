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
  try {
    const response = await axiosClient.get(
      `/students/${studentId}/training-hours`,
    );

    const payload = response.data as Partial<StudentTrainingHours> | null;
    const trainingHours =
      typeof payload?.totalHours === "number" ? payload.totalHours : 0;

    return trainingHours;
  } catch (error) {
    if (axios.isAxiosError(error)) {
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
