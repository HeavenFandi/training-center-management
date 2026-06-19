import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTeachers } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetTeachers = createAsyncThunk(
  "teachers/actGetTeachers",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getTeachers();
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetTeachers;