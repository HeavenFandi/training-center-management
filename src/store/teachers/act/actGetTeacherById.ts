import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTeacherById } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actGetTeacherById = createAsyncThunk(
  "teachers/actGetTeacherById",
  async (id: string | number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have this teacher data and fetch completed (loading is idle), don't fetch again
    if (state.teachers.selectedTeacher?.id === id && state.teachers.selectedTeacherLoading === "idle") {
      return state.teachers.selectedTeacher;
    }
    
    try {
      const response = await getTeacherById(id);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetTeacherById;