import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateTeacherRequest, createTeacher, TeacherApiResponse } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actCreateTeacher = createAsyncThunk(
  "teachers/actCreateTeacher",
  async (data: CreateTeacherRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Create teacher payload:", data);
      const response = await createTeacher(data);
      console.log("Create teacher response:", response);
      return response;
    } catch (error) {
      console.error("actCreateTeacher error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actCreateTeacher;
