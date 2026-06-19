import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTeacherById } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetTeacherById = createAsyncThunk(
  "teachers/actGetTeacherById",
  async (id: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getTeacherById(id);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetTeacherById;