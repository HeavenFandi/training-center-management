import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateTeacherRequest, createTeacher, TeacherApiResponse } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actCreateTeacher = createAsyncThunk(
  "teachers/actCreateTeacher",
  async (data: CreateTeacherRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await createTeacher(data);
      return response;
    } catch (error) {
      console.error("actCreateTeacher error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actCreateTeacher;
