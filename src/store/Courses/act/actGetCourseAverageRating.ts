import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

interface GetAverageRatingPayload {
  courseId?: number;
}

const actGetCourseAverageRating = createAsyncThunk(
  "trainingSessions/actGetCourseAverageRating",
  async (payload: GetAverageRatingPayload, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    try {
      if (!payload.courseId) {
        return rejectWithValue("تعذر العثور على معرف الدورة");
      }
      
      // If we already have average rating (we'll just check if loading is succeeded and we have data, since we don't track per-course)
      // For simplicity, we'll skip caching for average rating since it's a single value that might change, but let's keep it for consistency
      if (state.trainingSessions.averageRating !== null && state.trainingSessions.averageRatingLoading === "succeeded") {
        return state.trainingSessions.averageRating;
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
