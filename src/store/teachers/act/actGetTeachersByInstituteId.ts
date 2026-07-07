import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTeachersByInstituteId } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actGetTeachersByInstituteId = createAsyncThunk(
  "teachers/actGetTeachersByInstituteId",
  async (instituteId: number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;

    // If we already have teachers data and fetch succeeded before, don't fetch again
    if (state.teachers.teachers.length > 0 && state.teachers.loading === "succeeded") {
      // Return existing data to avoid error state
      return state.teachers.teachers;
    }

    try {
      const response = await getTeachersByInstituteId(instituteId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetTeachersByInstituteId;
