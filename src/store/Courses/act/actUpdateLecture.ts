import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import {
  updateLecture,
  UpdateLectureRequest,
  LectureResponse,
} from "../../../api/trainingSessionApi";

interface UpdateLecturePayload {
  id: number;
  data: UpdateLectureRequest;
}

const actUpdateLecture = createAsyncThunk(
  "trainingSessions/actUpdateLecture",
  async ({ id, data }: UpdateLecturePayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await updateLecture(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateLecture;
