import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actDeleteGrade = createAsyncThunk(
  "grades/actDeleteGrade",
  async (gradeId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      await axiosClient.delete(`/grades/${gradeId}`);
      return gradeId;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actDeleteGrade;
