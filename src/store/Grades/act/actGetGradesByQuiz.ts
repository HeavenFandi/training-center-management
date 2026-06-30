import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface Grade {
  id: number;
  studentId: number;
  quizId: number;
  score: number;
  studentName?: string;
  quizName?: string;
}

const actGetGradesByQuiz = createAsyncThunk(
  "grades/actGetGradesByQuiz",
  async (quizId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<Grade[]>(`/grades/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetGradesByQuiz;
