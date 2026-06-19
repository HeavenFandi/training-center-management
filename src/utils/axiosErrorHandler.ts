import { isAxiosError } from "axios";

const axiosErrorHandler = (error: unknown) => {
  if (isAxiosError(error)) {
    if (!error.response) {
      // Network error (no response received)
      return "خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.";
    }
    return error.response?.data?.message || error.response?.data || error.message;
  } else {
    return "حدث خطأ غير متوقع";
  }
};

export default axiosErrorHandler;
