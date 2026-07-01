import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { ActiveCourse } from "../../../types/studentDashboard";
import { RootState } from "../../index";

const actFetchActiveStudentCourses = createAsyncThunk<
  ActiveCourse[],
  number,
  { rejectValue: string }
>(
  "studentProfile/actFetchActiveStudentCourses",
  async (studentId, thunkAPI) => {
    const { getState } = thunkAPI;
    const state = getState() as RootState;

    // If we already have active courses data and fetch completed (loading is false), don't fetch again
    if (
      state.studentProfile.activeCourses.length > 0 &&
      !state.studentProfile.activeCoursesLoading
    ) {
      return state.studentProfile.activeCourses;
    }

    try {
      console.log(
        "[DEBUG actFetchActiveStudentCourses] Fetching active courses for student id:",
        studentId,
      );
      const url = `/enrollments/student/${studentId}/active`;
      console.log("[DEBUG actFetchActiveStudentCourses] Request URL:", url);
      const response = await axiosClient.get(url);
      console.log(
        "[DEBUG actFetchActiveStudentCourses] Response data:",
        response.data,
      );

      // Handle possible response formats and preserve the full array from the backend.
      let rawCourses: Array<Record<string, unknown>> = [];
      if (Array.isArray(response.data)) {
        rawCourses = response.data as Array<Record<string, unknown>>;
      } else if (typeof response.data === "object" && response.data !== null) {
        const responseData = response.data as Record<string, unknown>;
        if ("data" in responseData && Array.isArray(responseData.data)) {
          rawCourses = responseData.data as Array<Record<string, unknown>>;
        } else if (
          "courses" in responseData &&
          Array.isArray(responseData.courses)
        ) {
          rawCourses = responseData.courses as Array<Record<string, unknown>>;
        }
      }

      const courses: ActiveCourse[] = rawCourses.map((item) => {
        const itemRecord = item as Record<string, unknown>;
        const toNumber = (value: unknown, fallback = 0): number => {
          const parsed = typeof value === "number" ? value : Number(value);
          return Number.isFinite(parsed) ? parsed : fallback;
        };

        const totalLectures = toNumber(
          itemRecord.totalLectures ??
            itemRecord.total_lectures ??
            itemRecord.lessons,
          0,
        );
        const lecturesAttended = toNumber(itemRecord.lecturesAttended, 0);
        const attendancePercentage = toNumber(
          itemRecord.attendancePercentage,
          0,
        );
        const normalizedAttendance =
          attendancePercentage > 1
            ? attendancePercentage
            : attendancePercentage * 100;

        const courseTitle =
          typeof itemRecord.courseName === "string"
            ? itemRecord.courseName
            : typeof itemRecord.title === "string"
              ? itemRecord.title
              : "";
        const imageValue =
          typeof itemRecord.image === "string" ? itemRecord.image : "";
        const studentIdValue = toNumber(itemRecord.studentId, 0);
        const trainingSessionIdValue = toNumber(
          itemRecord.trainingSessionId ?? itemRecord.id,
          0,
        );

        return {
          studentId: studentIdValue,
          trainingSessionId: trainingSessionIdValue,
          courseName: courseTitle,
          totalLectures,
          lecturesAttended,
          image: imageValue.trim() ? imageValue : "",
          startDate:
            typeof itemRecord.startDate === "string"
              ? itemRecord.startDate
              : null,
          attendancePercentage: normalizedAttendance,
        };
      });

      console.log(
        "[DEBUG actFetchActiveStudentCourses] Processed courses:",
        courses,
      );
      return courses;
    } catch (error) {
      console.error("[DEBUG actFetchActiveStudentCourses] === ERROR ===");
      console.error("[DEBUG actFetchActiveStudentCourses] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          "[DEBUG actFetchActiveStudentCourses] Axios error details:",
          {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
        );
        const apiMessage =
          typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.message ||
              error.response?.data?.error ||
              "فشل تحميل الدورات النشطة";
        return thunkAPI.rejectWithValue(apiMessage);
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

export default actFetchActiveStudentCourses;
