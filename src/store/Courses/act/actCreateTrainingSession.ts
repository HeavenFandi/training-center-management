import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTrainingSession,
  CreateTrainingSessionRequest,
  TrainingSessionResponse,
} from "../../../api/trainingSessionApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actCreateTrainingSession = createAsyncThunk(
  "courses/actCreateTrainingSession",
  async (data: CreateTrainingSessionRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await createTrainingSession(data);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actCreateTrainingSession;
