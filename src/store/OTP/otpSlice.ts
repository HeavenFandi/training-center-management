import { createSlice } from "@reduxjs/toolkit";
import actSendOtp from "./act/actSendOtp";
import actVerifyOtp from "./act/actVerifyOtp";
import actResetPassword from "./act/actResetPassword";

interface OtpState {
  sendLoading: boolean;
  sendError: string | null;
  sendSuccess: boolean;
  verifyLoading: boolean;
  verifyError: string | null;
  verifySuccess: boolean;
  resetPasswordLoading: boolean;
  resetPasswordError: string | null;
  resetPasswordSuccess: boolean;
  message: string | null;
}

const initialState: OtpState = {
  sendLoading: false,
  sendError: null,
  sendSuccess: false,
  verifyLoading: false,
  verifyError: null,
  verifySuccess: false,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
  message: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.sendLoading = false;
      state.sendError = null;
      state.sendSuccess = false;
      state.verifyLoading = false;
      state.verifyError = null;
      state.verifySuccess = false;
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actSendOtp.pending, (state) => {
        console.log("[DEBUG otpSlice] actSendOtp.pending");
        state.sendLoading = true;
        state.sendError = null;
        state.sendSuccess = false;
        state.message = null;
      })
      .addCase(actSendOtp.fulfilled, (state, action) => {
        console.log("[DEBUG otpSlice] actSendOtp.fulfilled, payload:", action.payload);
        state.sendLoading = false;
        state.sendError = null;
        state.sendSuccess = true;
        state.message = action.payload;
      })
      .addCase(actSendOtp.rejected, (state, action) => {
        console.error("[DEBUG otpSlice] actSendOtp.rejected, payload:", action.payload);
        state.sendLoading = false;
        state.sendError = action.payload as string;
        state.sendSuccess = false;
        state.message = null;
      });

    builder
      .addCase(actVerifyOtp.pending, (state) => {
        console.log("[DEBUG otpSlice] actVerifyOtp.pending");
        state.verifyLoading = true;
        state.verifyError = null;
        state.verifySuccess = false;
        state.message = null;
      })
      .addCase(actVerifyOtp.fulfilled, (state, action) => {
        console.log("[DEBUG otpSlice] actVerifyOtp.fulfilled, payload:", action.payload);
        state.verifyLoading = false;
        state.verifyError = null;
        state.verifySuccess = true;
        state.message = action.payload;
      })
      .addCase(actVerifyOtp.rejected, (state, action) => {
        console.error("[DEBUG otpSlice] actVerifyOtp.rejected, payload:", action.payload);
        state.verifyLoading = false;
        state.verifyError = action.payload as string;
        state.verifySuccess = false;
        state.message = null;
      });

    builder
      .addCase(actResetPassword.pending, (state) => {
        console.log("[DEBUG otpSlice] actResetPassword.pending");
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
        state.message = null;
      })
      .addCase(actResetPassword.fulfilled, (state, action) => {
        console.log("[DEBUG otpSlice] actResetPassword.fulfilled, payload:", action.payload);
        state.resetPasswordLoading = false;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = true;
        state.message = action.payload;
      })
      .addCase(actResetPassword.rejected, (state, action) => {
        console.error("[DEBUG otpSlice] actResetPassword.rejected, payload:", action.payload);
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload as string;
        state.resetPasswordSuccess = false;
        state.message = null;
      });
  },
});

export { actSendOtp, actVerifyOtp, actResetPassword };
export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
