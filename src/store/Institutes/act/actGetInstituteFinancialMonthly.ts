import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteFinancialMonthly } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteFinancialMonthly = createAsyncThunk(
  "institutes/actGetInstituteFinancialMonthly",
  async ({ id, year }: { id: number | string; year?: number }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getInstituteFinancialMonthly(id, year);
      return response;
    } catch (error) {
      console.error("actGetInstituteFinancialMonthly error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteFinancialMonthly;
