import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteFinancialMonthly } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteFinancialMonthly = createAsyncThunk(
  "institutes/actGetInstituteFinancialMonthly",
  async ({ id, year }: { id: number | string; year?: number }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Institute ID (act):", id);
      console.log("Year (act):", year);
      const response = await getInstituteFinancialMonthly(id, year);
      console.log("Financial monthly response (act):", response);
      return response;
    } catch (error) {
      console.error("actGetInstituteFinancialMonthly error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteFinancialMonthly;
