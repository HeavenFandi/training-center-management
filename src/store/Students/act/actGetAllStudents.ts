import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getAllStudents } from "../../../api/studentApi";

const actGetAllStudents = createAsyncThunk(
  "students/actGetAllStudents",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await getAllStudents();
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetAllStudents;
