import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
});

axiosClient.interceptors.request.use((config) => {
  console.log("[DEBUG axiosClient] Request config:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    fullURL: config.baseURL + config.url,
    headers: config.headers,
    data: config.data,
    dataType: typeof config.data
  });
  
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
    console.error("[DEBUG axiosClient] Response error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export default axiosClient;
