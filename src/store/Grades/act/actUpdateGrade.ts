import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

type UpdateGradePayload = {
  id: number;
  studentId: number;
  quizId: number;
  score: number;
};

const actUpdateGrade = createAsyncThunk(
  "grades/actUpdateGrade",
  async (data: UpdateGradePayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const { id, ...body } = data;
      const response = await axiosClient.put(`/grades/${id}`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateGrade;
