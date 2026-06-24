import { createAsyncThunk } from "@reduxjs/toolkit";
import { getClassroomsByInstituteId } from "../../../api/classroomApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actGetClassroomsByInstituteId = createAsyncThunk(
  "classrooms/actGetClassroomsByInstituteId",
  async (instituteId: number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;

    // If we already have classrooms data and fetch completed (loading is false), don't fetch again
    if (state.classrooms.list.length > 0 && !state.classrooms.loading) {
      // Return existing data to avoid error state
      return state.classrooms.list;
    }

    try {
      const response = await getClassroomsByInstituteId(instituteId);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actGetClassroomsByInstituteId;
