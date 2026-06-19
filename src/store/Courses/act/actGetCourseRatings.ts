import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface CourseRating {
  id: number;
  courseId: number;
  courseName: string;
  userId: number;
  username: string;
  rating: number;
  review: string;
}

// Let's update the thunk to accept either courseId or trainingSessionId
interface GetRatingsPayload {
  courseId?: number;
}

const actGetCourseRatings = createAsyncThunk(
  "trainingSessions/actGetCourseRatings",
  async (payload: GetRatingsPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      if (!payload.courseId) {
        return rejectWithValue("تعذر العثور على معرف الدورة");
      }

      console.log("Fetching ratings for courseId:", payload.courseId);
      const response = await axiosClient.get<CourseRating[]>(
        `/courses/${payload.courseId}/ratings`,
      );
      console.log("Course ratings response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetCourseRatings;
