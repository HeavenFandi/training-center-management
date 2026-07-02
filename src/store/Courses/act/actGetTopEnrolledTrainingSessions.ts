import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTopEnrolledTrainingSessions,
  TrainingSessionResponse,
} from "../../../api/trainingSessionApi";

const actGetTopEnrolledTrainingSessions = createAsyncThunk<
  TrainingSessionResponse[],
  void,
  { rejectValue: string }
>("trainingSessions/actGetTopEnrolledTrainingSessions", async (_, thunkAPI) => {
  try {
    const response = await getTopEnrolledTrainingSessions();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || error?.message || "فشل تحميل البيانات",
    );
  }
});

export default actGetTopEnrolledTrainingSessions;
