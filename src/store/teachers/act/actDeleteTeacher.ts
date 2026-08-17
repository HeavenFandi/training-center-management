import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { deleteTeacher } from "../../../api/teacherApi";

const actDeleteTeacher = createAsyncThunk(
  "teachers/actDeleteTeacher",
  async (id: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      await deleteTeacher(id);
      return id;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteTeacher;
