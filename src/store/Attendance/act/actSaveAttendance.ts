import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface AttendanceRecord {
  studentId: number;
  status: "PRESENT" | "ABSENT";
}

export interface SaveAttendanceRequest {
  lectureId: number;
  records: AttendanceRecord[];
}

const actSaveAttendance = createAsyncThunk(
  "attendance/actSaveAttendance",
  async (data: SaveAttendanceRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.post("/attendance/bulk", data);

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actSaveAttendance;
