import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteMonthlyRegistrations } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteMonthlyRegistrations = createAsyncThunk(
  "institutes/actGetInstituteMonthlyRegistrations",
  async ({ id, year }: { id: number | string; year: number }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Institute ID (act):", id);
      console.log("Year (act):", year);
      const response = await getInstituteMonthlyRegistrations(id, year);
      console.log("Monthly registrations response (act):", response);
      console.log("Response type:", typeof response);
      console.log("Is array:", Array.isArray(response));
      if (Array.isArray(response)) {
        console.log("Response length:", response.length);
        console.log("First item (if exists):", response[0]);
      }
      return response;
    } catch (error) {
      console.error("actGetInstituteMonthlyRegistrations error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteMonthlyRegistrations;