import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export interface Quiz {
  id: number;
  name: string;
  maxScore: number;
  passingScore: number;
  createdAt: string;
  trainingSessionId: number;
}

const actGetQuizzes = createAsyncThunk(
  "quizzes/getQuizzes",
  async (trainingSessionId: number, thunkAPI) => {
    try {
      const res = await axiosClient.get(
        `/training-sessions/${trainingSessionId}/quizzes`,
      );

      return res.data as Quiz[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch quizzes",
      );
    }
  },
);

export default actGetQuizzes;
