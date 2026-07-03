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

const savedUser = localStorage.getItem("user");
const savedStudentId = localStorage.getItem("studentId");
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

// If we have a saved user and saved studentId but user doesn't have studentId, add it
if (parsedUser && savedStudentId && !parsedUser.studentId) {
  parsedUser.studentId = Number(savedStudentId);
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
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(actAuthLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
        state.isAuthenticated = true;
        state.loginError = null;
        
        // Keep localStorage in sync
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("userType", action.payload.userType);
        localStorage.setItem("userId", String(action.payload.id));
        if (action.payload.studentId) {
          localStorage.setItem("studentId", String(action.payload.studentId));
        }
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(actAuthLogin.rejected, (state, action) => {
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
