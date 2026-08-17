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

      const response = await axiosClient.post<TRatingResponse>(url, payload, {
        params: {
          studentId: data.studentId,
        },
      });

      return response.data;
    } catch (error) {
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
