import axios from "axios";
import authTokenManager from "../utils/authTokenManager";

const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("studentId");
      localStorage.removeItem("userId");
      authTokenManager.removeToken();
    }
  }
  return config;
});

const clearAllAuthKeys = () => {
  const AUTH_KEYS = ["user", "userType", "studentId", "userId"] as const;
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  authTokenManager.removeToken();
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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // remove token explicitly and clear any auth-related storage
      try {
        authTokenManager.removeToken();
      } catch (e) {
        // keep behavior unchanged on removal failure
      }
      clearAllAuthKeys();
      // redirect to login when unauthorized
      try {
        window.location.href = "/login";
      } catch (e) {
        // ignore if running in non-browser environment
      }
    }

    // normalize error message for all rejections
    const normalizedMessage = error.response?.data?.message || error.message;
    if (normalizedMessage) {
      error.message = normalizedMessage;
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
