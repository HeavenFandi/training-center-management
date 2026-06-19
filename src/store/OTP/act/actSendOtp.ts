import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const actSendOtp = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("otp/actSendOtp", async (email, thunkAPI) => {
  try {
    console.log("[DEBUG actSendOtp] === START SEND OTP ===");
    console.log("[DEBUG actSendOtp] Sending OTP to email:", email);

    const response = await axiosClient.post<string>("/otp/send", null, {
      params: { email }
    });
    
    console.log("[DEBUG actSendOtp] Response received:", response.data);
    console.log("[DEBUG actSendOtp] === END SEND OTP (SUCCESS) ===");
    
    return response.data;
  } catch (error) {
    console.error("[DEBUG actSendOtp] === SEND OTP FAILED ===");
    console.error("[DEBUG actSendOtp] Error:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actSendOtp] ❌ Server Response Data:", error.response?.data);
      
      const serverData = error.response?.data;
      const apiMessage =
        typeof serverData === "string"
          ? serverData
          : serverData?.message || serverData?.error || "";
      
      if (!error.response) {
        return thunkAPI.rejectWithValue("خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.");
      }
      
      return thunkAPI.rejectWithValue(apiMessage || "فشل إرسال الرمز");
    }
    
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actSendOtp;
