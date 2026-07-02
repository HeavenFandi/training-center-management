import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface WeeklyScheduleItem {
  day: string;
  lectureDate: string;
  courseName: string;
  startTime: string;
  endTime: string;
  teacherName: string;
  room: string;
}

type GetTeacherWeeklyScheduleParams = {
  teacherId: number;
  date: string;
};

const actGetTeacherWeeklySchedule = createAsyncThunk(
  "teachers/actGetTeacherWeeklySchedule",
  async ({ teacherId, date }: GetTeacherWeeklyScheduleParams, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<WeeklyScheduleItem[]>(
        `/teachers/${teacherId}/weekly-schedule`,
        {
          params: { date },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetTeacherWeeklySchedule;
