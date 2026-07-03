import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchStudents } from "../../../api/studentApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actSearchStudents = createAsyncThunk(
  "students/actSearchStudents",
  async (query: string, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    const instituteId = state.institutes.currentInstitute?.id;
    
    try {
      if (!query.trim() || !instituteId) {
        // If query is empty or no instituteId, return empty
        return [];
      }
      const response = await searchStudents(query, instituteId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actSearchStudents;
