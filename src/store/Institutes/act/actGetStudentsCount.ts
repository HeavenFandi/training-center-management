import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStudentsCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetStudentsCount = createAsyncThunk(
  "institutes/actGetStudentsCount",
  async (tenantId: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Fetching students count for tenantId:", tenantId);
      const response = await getStudentsCount(tenantId);
      console.log("Students count response:", response);
      return response;
    } catch (error) {
      console.error("actGetStudentsCount error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetStudentsCount;
