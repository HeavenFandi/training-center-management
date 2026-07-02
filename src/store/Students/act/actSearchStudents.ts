import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchStudents } from "../../../api/studentApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actSearchStudents = createAsyncThunk(
  "students/actSearchStudents",
  async (query: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    
    try {
      if (!query.trim()) {
        // If query is empty, we'll fall back to getStudents in the slice/hook
        return [];
      }
      const response = await searchStudents(query);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actSearchStudents;
