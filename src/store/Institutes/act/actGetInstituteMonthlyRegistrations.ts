import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteMonthlyRegistrations } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteMonthlyRegistrations = createAsyncThunk(
  "institutes/actGetInstituteMonthlyRegistrations",
  async ({ id, year }: { id: number | string; year: number }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Fetching monthly registrations for id:", id, "year:", year);
      const response = await getInstituteMonthlyRegistrations(id, year);
      console.log("Monthly registrations response:", response);
      return response;
    } catch (error) {
      console.error("actGetInstituteMonthlyRegistrations error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteMonthlyRegistrations;