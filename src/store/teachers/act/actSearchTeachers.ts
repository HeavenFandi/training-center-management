import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchTeachers } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actSearchTeachers = createAsyncThunk(
  "teachers/actSearchTeachers",
  async (query: string, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    const instituteId = state.institutes.currentInstitute?.id;
    
    try {
      if (!query.trim() || !instituteId) {
        // If query is empty or no instituteId, return empty
        return [];
      }
      const response = await searchTeachers(query, instituteId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actSearchTeachers;
