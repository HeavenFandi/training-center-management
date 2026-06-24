import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { searchCourses, SearchCourseResponse } from "../../../api/courseApi";

interface SearchCoursesParams {
  name: string;
  tenantId: number;
}

const actSearchCourses = createAsyncThunk<SearchCourseResponse[], SearchCoursesParams>(
  "courses/actSearchCourses",
  async ({ name, tenantId }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await searchCourses(name, tenantId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actSearchCourses;
