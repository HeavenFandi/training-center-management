import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import {
  createLecture,
  CreateLectureRequest,
  LectureResponse,
} from "../../../api/trainingSessionApi";

interface CreateLecturePayload {
  sessionId: number;
  data: CreateLectureRequest;
}

const actCreateLecture = createAsyncThunk(
  "trainingSessions/actCreateLecture",
  async ({ sessionId, data }: CreateLecturePayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await createLecture(sessionId, data);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actCreateLecture;
