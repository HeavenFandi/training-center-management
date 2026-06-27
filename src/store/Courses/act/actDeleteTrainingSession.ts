import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { deleteTrainingSession } from "../../../api/trainingSessionApi";

const actDeleteTrainingSession = createAsyncThunk(
  "trainingSessions/actDeleteTrainingSession",
  async (sessionId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      await deleteTrainingSession(sessionId);
      return sessionId;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteTrainingSession;
