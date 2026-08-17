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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
