import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClassroom, CreateClassroomRequest, Classroom } from "../../../api/classroomApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actCreateClassroom = createAsyncThunk(
  "classrooms/actCreateClassroom",
  async (data: CreateClassroomRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await createClassroom(data);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actCreateClassroom;