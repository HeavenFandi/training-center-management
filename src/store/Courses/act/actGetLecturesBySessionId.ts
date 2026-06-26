import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getLecturesBySessionId, LectureResponse } from "../../../api/trainingSessionApi";

const actGetLecturesBySessionId = createAsyncThunk(
  "trainingSessions/actGetLecturesBySessionId",
  async (sessionId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const lectures = await getLecturesBySessionId(sessionId);
      return { sessionId, lectures };
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetLecturesBySessionId;
