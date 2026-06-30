import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

type CreateGradeType = {
  studentId: number;
  quizId: number;
  score: number;
};

const actCreateGrade = createAsyncThunk(
  "grades/create",
  async (data: CreateGradeType, thunkAPI) => {
    try {
      const response = await axiosClient.post("/grades", data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء إضافة العلامة",
      );
    }
  },
);

export default actCreateGrade;
