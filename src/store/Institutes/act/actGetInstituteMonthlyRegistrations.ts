import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteMonthlyRegistrations } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteMonthlyRegistrations = createAsyncThunk(
  "institutes/actGetInstituteMonthlyRegistrations",
  async ({ id, year }: { id: number | string; year: number }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getInstituteMonthlyRegistrations(id, year);
      return response;
    } catch (error) {
      console.error("actGetInstituteMonthlyRegistrations error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteMonthlyRegistrations;