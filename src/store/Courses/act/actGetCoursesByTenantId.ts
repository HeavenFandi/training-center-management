import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { getCoursesByTenantId } from "../../../api/courseApi";
import { TCourse } from "../../../types/cardType";
import { RootState } from "../../index";

const actGetCoursesByTenantId = createAsyncThunk<TCourse[], string>(
  "trainingSessions/actGetCoursesByTenantId",
  async (tenantId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have courses data and fetch succeeded before, don't fetch again
    if (state.courses.courses.length > 0 && state.courses.loading === "succeeded") {
      // Return existing data to avoid error state
      return state.courses.courses;
    }
    
    try {
      const response = await getCoursesByTenantId(tenantId);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetCoursesByTenantId;
