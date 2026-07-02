import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface TeacherCourseProgress {
  trainingSessionId: number;
  courseName: string;
  image: string;
  lecturesGiven: number;
  numberOfStudents: number;
  progressPercentage: number;
  startDate: string;
  totalLectures: number;
}
const actGetTeacherCourseProgress = createAsyncThunk(
  "teachers/actGetTeacherCourseProgress",
  async (teacherId: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<TeacherCourseProgress[]>(
        `/teachers/${teacherId}/course-progress`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetTeacherCourseProgress;
