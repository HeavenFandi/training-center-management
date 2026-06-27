import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { deleteLecture } from "../../../api/trainingSessionApi";

const actDeleteLecture = createAsyncThunk(
  "trainingSessions/actDeleteLecture",
  async (id: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      await deleteLecture(id);
      return id;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actDeleteLecture;
