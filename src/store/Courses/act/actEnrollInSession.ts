import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface TEnrollmentPayload {
  studentId: number;
  trainingSessionId: number;
}

interface TEnrollmentResponse {
  id: number;
  studentId: number;
  trainingSessionId: number;
  createdAt: string;
}

const actEnrollInSession = createAsyncThunk(
  "trainingSessions/actEnrollInSession",
  async (data: TEnrollmentPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axiosClient.post<TEnrollmentResponse>(
        "/enrollments",
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actEnrollInSession;
