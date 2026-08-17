import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteUsersCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteUsersCount = createAsyncThunk(
  "institutes/actGetInstituteUsersCount",
  async (id: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await getInstituteUsersCount(id);
      return response;
    } catch (error) {
      console.error("actGetInstituteUsersCount error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteUsersCount;
