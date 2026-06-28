import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use((config) => {
  console.log("=== [DEBUG axiosClient] REQUEST SENDING ===");
  console.log("Full URL:", (config.baseURL ?? "") + (config.url ?? ""));
  console.log("Method:", config.method?.toUpperCase());
  console.log("Request Payload (JSON stringified):", JSON.stringify(config.data, null, 2));
  console.log("Request Payload raw:", config.data);
  
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    const token = parsedUser.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[DEBUG axiosClient] Added Authorization header");
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("[DEBUG axiosClient] Response received:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("=== [DEBUG axiosClient] RESPONSE ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Response Data (full):", error.response?.data);
    console.error("Error message:", error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
