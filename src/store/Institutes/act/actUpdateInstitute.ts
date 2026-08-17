import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateInstitute, UpdateInstituteRequest } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface UpdateInstituteArgs {
  id: number;
  data: UpdateInstituteRequest;
}

const actUpdateInstitute = createAsyncThunk(
  "institutes/actUpdateInstitute",
  async ({ id, data }: UpdateInstituteArgs, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await updateInstitute(id, data);
      return response;
    } catch (error) {
      console.error("actUpdateInstitute error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateInstitute;
