import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface AttendanceRecordResponse {
  id: number;
  studentId: number;
  studentFullName?: string;
  lectureId: number;
  lectureDate?: string;
  status: "PRESENT" | "ABSENT";
  checkInTime?: string;
  attendancePercentage?: number;
}

const actGetAttendanceByLecture = createAsyncThunk(
  "attendance/actGetAttendanceByLecture",
  async (lectureId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<AttendanceRecordResponse[]>(
        `/attendance/lecture/${lectureId}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetAttendanceByLecture;
