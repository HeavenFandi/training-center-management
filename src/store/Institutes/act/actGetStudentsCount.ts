import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStudentsCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetStudentsCount = createAsyncThunk(
  "institutes/actGetStudentsCount",
  async (tenantId: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getStudentsCount(tenantId);
      return response;
    } catch (error) {
      console.error("actGetStudentsCount error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetStudentsCount;
