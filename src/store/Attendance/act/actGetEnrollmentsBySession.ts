import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface EnrollmentStudent {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
}

export interface EnrollmentBySession {
  id: number;
  student: EnrollmentStudent;
  trainingSessionId: number;
  createdAt: string;
}

const actGetEnrollmentsBySession = createAsyncThunk(
  "attendance/actGetEnrollmentsBySession",
  async (sessionId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<EnrollmentBySession[]>(
        `/enrollments/sessions/${sessionId}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetEnrollmentsBySession;
