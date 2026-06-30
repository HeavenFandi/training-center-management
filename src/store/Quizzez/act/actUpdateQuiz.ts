import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { Quiz } from "./actCreateQuiz";

export interface UpdateQuizPayload {
  id: number;
  name: string;
  maxScore: number;
  passingScore: number;
  trainingSessionId: number;
}

const actUpdateQuiz = createAsyncThunk(
  "quizzes/actUpdateQuiz",
  async (payload: UpdateQuizPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { id, ...body } = payload;

    try {
      const response = await axiosClient.put<Quiz>(`/quizzes/${id}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateQuiz;
