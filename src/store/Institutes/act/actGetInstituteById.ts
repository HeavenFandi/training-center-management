import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteById } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteById = createAsyncThunk(
  "institutes/actGetInstituteById",
  async (instituteId: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await getInstituteById(instituteId);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actGetInstituteById;
