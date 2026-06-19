import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const actResetPassword = createAsyncThunk<
  string,
  { email: string; newPassword: string },
  { rejectValue: string }
>("otp/actResetPassword", async ({ email, newPassword }, thunkAPI) => {
  try {
    console.log("[DEBUG actResetPassword] === START RESET PASSWORD ===");
    console.log("[DEBUG actResetPassword] Resetting password for email:", email);

    const response = await axiosClient.post<string>("/otp/reset-password", {
      email,
      newPassword,
    });
    
    console.log("[DEBUG actResetPassword] API Response received:", response.data);
    console.log("[DEBUG actResetPassword] === END RESET PASSWORD (SUCCESS) ===");
    
    return response.data;
  } catch (error) {
    console.error("[DEBUG actResetPassword] === RESET PASSWORD FAILED ===");
    console.error("[DEBUG actResetPassword] Error:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("[DEBUG actResetPassword] ❌ Server Response Data:", error.response?.data);
      
      const serverData = error.response?.data;
      const apiMessage =
        typeof serverData === "string"
          ? serverData
          : serverData?.message || serverData?.error || "";
      
      if (!error.response) {
        return thunkAPI.rejectWithValue("خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.");
      }
      
      return thunkAPI.rejectWithValue(apiMessage || "فشل إعادة تعيين كلمة المرور");
    }
    
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export default actResetPassword;
