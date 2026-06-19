import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInstituteByTenantId } from "../../../api/instituteApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actGetInstituteByTenantId = createAsyncThunk(
  "institutes/actGetInstituteByTenantId",
  async (tenantId: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await getInstituteByTenantId(tenantId);
      return response[0];
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actGetInstituteByTenantId;
