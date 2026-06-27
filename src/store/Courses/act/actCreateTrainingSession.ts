import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
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
      if (isAxiosError(error) && error.response?.status === 409) {
        return rejectWithValue({
          status: 409,
          data: error.response.data
        });
      }
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actCreateTrainingSession;
