import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface TPaymentPayload {
  sessionId: number;
  studentId: number;
}

const actInitiatePayment = createAsyncThunk(
  "trainingSessions/actInitiatePayment",
  async (payload: TPaymentPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axiosClient.post<string>(
        `/payments/initiate/${payload.sessionId}`,
        {},
        {
          params: {
            studentId: payload.studentId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in actInitiatePayment:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actInitiatePayment;
