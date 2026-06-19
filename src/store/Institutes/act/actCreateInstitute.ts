import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface CreateInstitutePayload {
  userId: number;
  name: string;
  location: string;
  description: string;
  phoneNumber: string;
  email: string;
  startTime: string;
  endTime: string;
  workingDays: string[];
  status: "ACTIVE" | "INACTIVE";
}

const actCreateInstitute = createAsyncThunk(
  "institutes/actCreateInstitute",
  async (data: CreateInstitutePayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.post("/institutes", data);
      return response.data;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actCreateInstitute;
