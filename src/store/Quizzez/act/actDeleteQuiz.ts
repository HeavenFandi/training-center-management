import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actDeleteQuiz = createAsyncThunk(
  "quizzes/actDeleteQuiz",
  async (quizId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      await axiosClient.delete(`/quizzes/${quizId}`);
      return quizId;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actDeleteQuiz;
