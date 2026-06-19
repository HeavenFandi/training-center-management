import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface TRatingPayload {
  courseId?: number;
  studentId: number;
  rating: number;
  review: string;
}

interface TRatingResponse {
  id: number;
  courseId: number;
  courseName: string;
  userId: number;
  username: string;
  rating: number;
  review: string;
}

const actAddCourseRating = createAsyncThunk(
  "trainingSessions/actAddCourseRating",
  async (data: TRatingPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    console.log("actAddCourseRating - courseId:", data.courseId);
    console.log("actAddCourseRating - studentId:", data.studentId);
    console.log("actAddCourseRating - request payload:", {
      courseId: data.courseId,
      rating: data.rating,
      review: data.review,
    });

    if (!data.courseId) {
      console.error("Course ID not found in session data");
      return rejectWithValue("تعذر العثور على معرف الدورة");
    }

    try {
      const payload = {
        courseId: data.courseId,
        rating: data.rating,
        review: data.review,
      };

      const url = `/courses/${data.courseId}/ratings`;
      const fullUrl = axiosClient.defaults.baseURL
        ? `${axiosClient.defaults.baseURL}${url}`
        : url;
      console.log("actAddCourseRating - posting to courses URL:", fullUrl);

      const response = await axiosClient.post<TRatingResponse>(url, payload, {
        params: {
          studentId: data.studentId,
        },
      });

      console.log("actAddCourseRating - courses response:", response.data);
      return response.data;
    } catch (error) {
      console.log("actAddCourseRating - error:", error);
     
      const errorMsg = axiosErrorHandler(error);
      if (
        typeof errorMsg === "string" &&
        errorMsg.includes("Student not found")
      ) {
        return rejectWithValue(
          "لم يتم العثور على سجل الطالب لهذا المستخدم. يرجى التأكد من إكمال بيانات ملفك الشخصي كطالب.",
        );
      }
      return rejectWithValue(errorMsg);
    }
  },
);

export default actAddCourseRating;
