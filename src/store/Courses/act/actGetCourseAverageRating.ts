import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface GetAverageRatingPayload {
  courseId?: number;
}

const actGetCourseAverageRating = createAsyncThunk(
  "trainingSessions/actGetCourseAverageRating",
  async (payload: GetAverageRatingPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      if (!payload.courseId) {
        return rejectWithValue("تعذر العثور على معرف الدورة");
      }

      console.log("Fetching average rating for courseId:", payload.courseId);
      const response = await axiosClient.get<number>(
        `/courses/${payload.courseId}/ratings/average`,
      );
      console.log("Course average rating response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetCourseAverageRating;
