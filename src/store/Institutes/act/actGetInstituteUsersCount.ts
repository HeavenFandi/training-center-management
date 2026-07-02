import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteUsersCount } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteUsersCount = createAsyncThunk(
  "institutes/actGetInstituteUsersCount",
  async (id: string | number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Fetching institute users count for id:", id);
      const response = await getInstituteUsersCount(id);
      console.log("Institute users count response:", response);
      return response;
    } catch (error) {
      console.error("actGetInstituteUsersCount error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetInstituteUsersCount;
