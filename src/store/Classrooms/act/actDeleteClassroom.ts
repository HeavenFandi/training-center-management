import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteClassroom } from "../../../api/classroomApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actDeleteClassroom = createAsyncThunk(
  "classrooms/actDeleteClassroom",
  async (id: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      await deleteClassroom(id);
      return id;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actDeleteClassroom;