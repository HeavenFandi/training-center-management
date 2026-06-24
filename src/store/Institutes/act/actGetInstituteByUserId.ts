import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteByUserId } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actGetInstituteByUserId = createAsyncThunk(
  "institutes/actGetInstituteByUserId",
  async (userId: string | number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;

    // If we already have current institute data and fetch completed (loading is false), don't fetch again
    if (state.institutes.currentInstitute && !state.institutes.currentInstituteLoading) {
      // Return existing data to avoid error state
      return state.institutes.currentInstitute;
    }

    try {
      console.log("admin userId:", userId);
      const response = await getInstituteByUserId(userId);
      console.log("admin institute:", response);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actGetInstituteByUserId;
