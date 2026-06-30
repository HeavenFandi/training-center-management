import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import axiosErrorHandler from "../../utils/axiosErrorHandler";

export interface TrainingSession {
  id: number;
  courseName: string;
  teacherId: number;
  status: string;
}

const actGetActiveTrainingSessions = createAsyncThunk(
  "trainingSessions/actGetActiveTrainingSessions",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<TrainingSession[]>(
        "/training-sessions/active",
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetActiveTrainingSessions;
