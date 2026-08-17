import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateCourseRequest, createCourse, CreateCourseResponse } from "../../../api/courseApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actCreateCourse = createAsyncThunk(
  "courses/actCreateCourse",
  async (data: CreateCourseRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await createCourse(data);
      return response;
    } catch (error) {
      console.error("actCreateCourse error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actCreateCourse;
