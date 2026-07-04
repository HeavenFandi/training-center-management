import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteByUserId, Institute } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteByUserId = createAsyncThunk<
  Institute | null,
  string | number,
  { rejectValue: string }
>("institutes/actGetInstituteByUserId", async (userId, thunkAPI) => {
  try {
    return await getInstituteByUserId(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(axiosErrorHandler(error));
  }
});

export default actGetInstituteByUserId;
