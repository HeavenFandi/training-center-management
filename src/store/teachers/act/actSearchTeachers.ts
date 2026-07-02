import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchTeachers } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actSearchTeachers = createAsyncThunk(
  "teachers/actSearchTeachers",
  async (query: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    
    try {
      if (!query.trim()) {
        // If query is empty, we'll fall back to getTeachers in the slice/hook
        return [];
      }
      const response = await searchTeachers(query);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actSearchTeachers;
