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
      console.log("Update institute id:", id);
      console.log("Update institute payload:", data);
      const response = await updateInstitute(id, data);
      console.log("updateInstitute response:", response);
      return response;
    } catch (error) {
      console.error("actUpdateInstitute error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actUpdateInstitute;
