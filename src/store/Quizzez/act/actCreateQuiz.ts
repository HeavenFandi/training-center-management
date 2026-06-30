import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface CreateQuizPayload {
  name: string;
  maxScore: number;
  passingScore: number;
  trainingSessionId: number;
}

export interface Quiz {
  id: number;
  name: string;
  maxScore: number;
  passingScore: number;
  createdAt: string;
  trainingSessionId: number;
}

const actCreateQuiz = createAsyncThunk(
  "quizzes/actCreateQuiz",
  async (payload: CreateQuizPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.post<Quiz>("/quizzes", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actCreateQuiz;
