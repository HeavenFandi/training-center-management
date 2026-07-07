import { createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveStudentsCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetActiveStudentsCount = createAsyncThunk(
  "institutes/actGetActiveStudentsCount",
  async (tenantId: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const count = await getActiveStudentsCount(tenantId);
      return count;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetActiveStudentsCount;
