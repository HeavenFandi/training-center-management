import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import actAuthLogin, { User, UserType } from "./act/actAuthLogin";
import actAuthRegister from "./act/actAuthRegister";

interface AuthState {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  loginLoading: boolean;
  loginError: string | null;

  registerLoading: boolean;
  registerError: string | null;
  registerSuccess: boolean;
}

const AUTH_KEYS = [
  "user",
  "userType",
  "studentId",
  "userId",
  "token",
] as const;

const clearAllAuthKeys = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage).forEach((key) => {
    if (
      key.toLowerCase().includes("auth") ||
      key.toLowerCase().includes("token") ||
      key.toLowerCase().includes("user")
    ) {
      localStorage.removeItem(key);
    }
  });
};

const parseStoredUser = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const savedUser = localStorage.getItem("user");
    const savedStudentId = localStorage.getItem("studentId");

    if (!savedUser) {
      clearAllAuthKeys();
      return { user: null, isAuthenticated: false };
    }

    const parsedUser = JSON.parse(savedUser);

    // Fix: use user.id instead of token to check if stored user is valid!
    if (
      !parsedUser ||
      typeof parsedUser !== "object" ||
      !parsedUser.id
    ) {
      clearAllAuthKeys();
      return { user: null, isAuthenticated: false };
    }

    if (savedStudentId && !parsedUser.studentId) {
      parsedUser.studentId = Number(savedStudentId);
    }

    return { user: parsedUser, isAuthenticated: true };
  } catch (error) {
    clearAllAuthKeys();
    return { user: null, isAuthenticated: false };
  }
};

const { user: initialUser, isAuthenticated: initialAuth } = parseStoredUser();

const initialState: AuthState = {
  user: initialUser,
  userType: initialUser?.userType || null,
  isAuthenticated: initialAuth,
  isHydrated: false,
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
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.loginLoading = false;
      state.registerError = null;
      state.registerLoading = false;
      state.registerSuccess = false;
      clearAllAuthKeys();
    },
    resetAuthState: (state) => {
      state.loginError = null;
      state.loginLoading = false;
      state.registerError = null;
      state.registerLoading = false;
      state.registerSuccess = false;
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAuthLogin.pending, (state) => {
        if (import.meta.env.DEV) {
          console.log("🔄 authSlice: actAuthLogin.pending");
        }
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(actAuthLogin.fulfilled, (state, action: PayloadAction<User>) => {
        if (import.meta.env.DEV) {
          console.log("✅ authSlice: actAuthLogin.fulfilled", { payload: action.payload });
          console.log("  - action.payload.token:", action.payload.token);
          console.log("  - action.payload.id:", action.payload.id);
        }
        state.loginLoading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
        // Fix: use user.id instead of token to determine if authenticated!
        state.isAuthenticated = !!action.payload && !!action.payload.id;
        state.loginError = null;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("userType", action.payload.userType);
        localStorage.setItem("userId", String(action.payload.id));
        if (action.payload.studentId) {
          localStorage.setItem("studentId", String(action.payload.studentId));
        }
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
        if (import.meta.env.DEV) {
          console.log("🔐 authSlice: localStorage updated, state:", {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            userType: state.userType,
          });
        }
      })
      .addCase(actAuthLogin.rejected, (state, action) => {
        if (import.meta.env.DEV) {
          console.error("❌ authSlice: actAuthLogin.rejected", { payload: action.payload });
        }
        state.loginLoading = false;
        state.loginError = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.userType = null;
        clearAllAuthKeys();
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
export const { logout, resetAuthState, setHydrated } = authSlice.actions;
export default authSlice.reducer;
