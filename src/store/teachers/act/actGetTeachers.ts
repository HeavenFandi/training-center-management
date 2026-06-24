import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTeachers } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actGetTeachers = createAsyncThunk(
  "teachers/actGetTeachers",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have teachers data and fetch succeeded before, don't fetch again
    if (state.teachers.teachers.length > 0 && state.teachers.loading === "succeeded") {
      // Return existing data to avoid error state
      return state.teachers.teachers;
    }
    
    try {
      const response = await getTeachers();
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetTeachers;