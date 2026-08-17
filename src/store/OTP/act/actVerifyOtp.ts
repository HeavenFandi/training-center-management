import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

interface VerifyOtpPayload {
  email: string;
  code: string;
}

const actVerifyOtp = createAsyncThunk<
  string,
  VerifyOtpPayload,
  { rejectValue: string }
>("otp/actVerifyOtp", async ({ email, code }, thunkAPI) => {
  try {
    const response = await axiosClient.post<string>("/otp/verify", null, {
      params: { email, code }
    });
    
    return response.data;
  } catch (error) {
    console.error("[DEBUG actVerifyOtp] === VERIFY OTP FAILED ===");
    console.error("[DEBUG actVerifyOtp] Error:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actVerifyOtp] ❌ Server Response Data:", error.response?.data);
      
      const serverData = error.response?.data;
      const apiMessage =
        typeof serverData === "string"
          ? serverData
          : serverData?.message || serverData?.error || "";
      
      if (!error.response) {
        return thunkAPI.rejectWithValue("خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.");
      }
      
      return thunkAPI.rejectWithValue(apiMessage || "فشل التحقق من الرمز");
    }
    
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actVerifyOtp;
