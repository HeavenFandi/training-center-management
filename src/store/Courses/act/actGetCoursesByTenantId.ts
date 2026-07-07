import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getCoursesByTenantId } from "../../../api/courseApi";
import { TCourse } from "../../../types/cardType";

const actGetCoursesByTenantId = createAsyncThunk<TCourse[], string>(
  "trainingSessions/actGetCoursesByTenantId",
  async (tenantId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    
    try {
      const response = await getCoursesByTenantId(tenantId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetCoursesByTenantId;
