import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateTeacherRequest, updateTeacher, TeacherApiResponse } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface UpdateTeacherPayload {
  id: number;
  data: UpdateTeacherRequest;
}

const actUpdateTeacher = createAsyncThunk(
  "teachers/actUpdateTeacher",
  async ({ id, data }: UpdateTeacherPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await updateTeacher(id, data);
      return response;
    } catch (error) {
      console.error("actUpdateTeacher error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actUpdateTeacher;
