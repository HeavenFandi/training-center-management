import { createSlice } from "@reduxjs/toolkit";
import actAuthLogin, { User, UserType } from "./act/actAuthLogin";
import actAuthRegister from "./act/actAuthRegister";

interface AuthState {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  loginLoading: boolean;
  loginError: string | null;

  registerLoading: boolean;
  registerError: string | null | Record<string, string[]>;
  registerSuccess: boolean;
}

console.log("[DEBUG authSlice] Initializing auth slice...");
const savedUser = localStorage.getItem("user");
const savedStudentId = localStorage.getItem("studentId");
console.log("[DEBUG authSlice] localStorage.user raw:", savedUser);
console.log("[DEBUG authSlice] localStorage.studentId raw:", savedStudentId);
const parsedUser = savedUser ? JSON.parse(savedUser) : null;
console.log("[DEBUG authSlice] parsedUser after JSON.parse:", parsedUser);

// If we have a saved user and saved studentId but user doesn't have studentId, add it
if (parsedUser && savedStudentId && !parsedUser.studentId) {
  parsedUser.studentId = Number(savedStudentId);
  console.log("[DEBUG authSlice] Added studentId to parsedUser:", parsedUser);
}

const initialState: AuthState = {
  user: parsedUser,
  userType: parsedUser?.userType || null,
  isAuthenticated: !!savedUser,
  loginLoading: false,
  loginError: null,

  registerLoading: false,
  registerError: null,
  registerSuccess: false,
};
console.log("[DEBUG authSlice] Initial auth state:", initialState);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("[DEBUG authSlice] logout called");
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.loginLoading = false;
      state.registerError = null;
      state.registerLoading = false;
      state.registerSuccess = false;
      
      // Clear all auth data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("studentId");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      
      // Clear any other possible auth keys
      Object.keys(localStorage).forEach((key) => {
        if (key.toLowerCase().includes("auth") || 
            key.toLowerCase().includes("token") || 
            key.toLowerCase().includes("user")) {
          localStorage.removeItem(key);
        }
      });
    },
    resetAuthState: (state) => {
      state.loginError = null;
      state.loginLoading = false;
      state.registerError = null;
      state.registerLoading = false;
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAuthLogin.pending, (state) => {
        console.log("[DEBUG authSlice] actAuthLogin.pending");
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(actAuthLogin.fulfilled, (state, action) => {
        console.log("[DEBUG authSlice] actAuthLogin.fulfilled, payload:", action.payload);
        state.loginLoading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
        state.isAuthenticated = true;
        state.loginError = null;
      })
      .addCase(actAuthLogin.rejected, (state, action) => {
        console.error("[DEBUG authSlice] actAuthLogin.rejected, payload:", action.payload);
        state.loginLoading = false;
        state.loginError = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(actAuthRegister.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(actAuthRegister.fulfilled, (state) => {
        state.registerLoading = false;
        state.registerError = null;
        state.registerSuccess = true;
      })
      .addCase(actAuthRegister.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload as string;
        state.registerSuccess = false;
      });
  },
});

export { actAuthLogin, actAuthRegister };
export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
