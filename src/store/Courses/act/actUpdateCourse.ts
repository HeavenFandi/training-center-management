import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateCourseRequest, updateCourse, UpdateCourseResponse } from "../../../api/courseApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actUpdateCourse = createAsyncThunk(
  "courses/actUpdateCourse",
  async (data: UpdateCourseRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await updateCourse(data);
      return response;
    } catch (error) {
      console.error("actUpdateCourse error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actUpdateCourse;
