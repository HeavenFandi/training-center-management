import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use((config) => {
  // Only log safe metadata in development mode
  if (import.meta.env.DEV) {
    console.log("[axiosClient] Request:", {
      method: config.method?.toUpperCase(),
      url: (config.baseURL ?? "") + (config.url ?? ""),
    });
  }
  
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Invalid JSON, clear all corrupted auth-related localStorage entries
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      localStorage.removeItem("studentId");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
