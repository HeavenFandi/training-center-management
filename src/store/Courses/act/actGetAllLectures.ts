import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getAllLectures, LectureResponse } from "../../../api/trainingSessionApi";

const actGetAllLectures = createAsyncThunk(
  "trainingSessions/actGetAllLectures",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const lectures = await getAllLectures();
      return lectures;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetAllLectures;
