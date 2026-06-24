import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

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
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    try {
      if (!payload.courseId) {
        return rejectWithValue("تعذر العثور على معرف الدورة");
      }
      
      // If we already have ratings for this course and fetch succeeded, don't fetch again
      const existingRatingsForCourse = state.trainingSessions.ratings.filter(r => r.courseId === payload.courseId);
      if (existingRatingsForCourse.length > 0 && state.trainingSessions.ratingsLoading === "succeeded") {
        return existingRatingsForCourse;
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
