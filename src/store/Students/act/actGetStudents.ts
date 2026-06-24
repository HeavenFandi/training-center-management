import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getStudents } from "../../../api/studentApi";
import { RootState } from "../../index";

const actGetStudents = createAsyncThunk(
  "students/actGetStudents",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have students data and fetch succeeded before, don't fetch again
    if (state.students.students.length > 0 && state.students.loading === "succeeded") {
      // Return existing data to avoid error state
      return state.students.students;
    }
    
    try {
      const response = await getStudents();
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetStudents;