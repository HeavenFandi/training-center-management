import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateTrainingSession, TrainingSessionResponse } from "../../../api/trainingSessionApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actUpdateTrainingSession = createAsyncThunk(
  "trainingSessions/actUpdateTrainingSession",
  async ({ id, data }: { id: number; data: any }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await updateTrainingSession(id, data);
      return response;
    } catch (error) {
      console.error("actUpdateTrainingSession error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateTrainingSession;
