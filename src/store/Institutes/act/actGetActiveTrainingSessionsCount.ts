import { createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveTrainingSessionsCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetActiveTrainingSessionsCount = createAsyncThunk(
  "institutes/actGetActiveTrainingSessionsCount",
  async (id: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const count = await getActiveTrainingSessionsCount(id);
      return count;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetActiveTrainingSessionsCount;
