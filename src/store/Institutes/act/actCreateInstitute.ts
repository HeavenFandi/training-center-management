import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { formatTimeToHHmmss } from "../../../utils/timeUtils";
import { RootState } from "../../index";

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

interface CreateInstituteApiPayload {
  userId: number;
  tenantId?: number;
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
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    const tenantId = state.auth.user?.tenantId;
    const username = state.auth.user?.username || "Owner";

    try {
      const apiPayload: CreateInstituteApiPayload = {
        userId: data.userId,
        name: data.name,
        location: data.location,
        description: data.description,
        phoneNumber: data.phoneNumber,
        email: data.email,
        startTime: formatTimeToHHmmss(data.startTime),
        endTime: formatTimeToHHmmss(data.endTime),
        workingDays: data.workingDays.map(day => day.toUpperCase()),
        status: data.status,
      };
      
      // Only add tenantId if it's not undefined
      if (tenantId !== undefined) {
        (apiPayload as any).tenantId = tenantId;
      }
      
    
      Object.entries(apiPayload).forEach(([key, value]) => {
        console.log(`${key}:`, {
          value,
          type: typeof value,
          isArray: Array.isArray(value),
          isNull: value === null,
          isUndefined: value === undefined,
        });
      });
   
      const response = await axiosClient.post("/institutes", apiPayload);
   
      return response.data;
    } catch (error) {
    
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actCreateInstitute;
