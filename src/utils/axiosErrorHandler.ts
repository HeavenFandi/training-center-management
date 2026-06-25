import { isAxiosError } from "axios";

const axiosErrorHandler = (error: unknown) => {
  console.error("Full axios error:", error);
  if (isAxiosError(error)) {
    console.error("Error response data:", error.response?.data);
    if (!error.response) {
      // Network error (no response received)
      return "خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.";
    }
    return error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
  } else {
    return "حدث خطأ غير متوقع";
  }
};

export default axiosErrorHandler;
