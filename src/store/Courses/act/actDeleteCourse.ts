import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { deleteCourse } from "../../../api/courseApi";

const actDeleteCourse = createAsyncThunk(
  "courses/actDeleteCourse",
  async (courseId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      await deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteCourse;
