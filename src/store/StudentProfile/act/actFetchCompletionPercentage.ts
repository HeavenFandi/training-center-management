import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosClient from "../../../api/axiosClient";
import { RootState } from "../../index";
import { CompletionPercentageItem } from "../../../types/studentDashboard";

const actFetchCompletionPercentage = createAsyncThunk<
  CompletionPercentageItem[],
  number,
  { rejectValue: string }
>(
  "studentProfile/actFetchCompletionPercentage",
  async (studentId, thunkAPI) => {
    try {
      const response = await axiosClient.get(
        `/students/${studentId}/completion-percentage`,
      );

      let rawData: any = response.data;
      if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
        if ("data" in rawData && Array.isArray(rawData.data)) {
          rawData = rawData.data;
        }
      }

      const items: CompletionPercentageItem[] = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
            studentId:
              typeof item.studentId === "number"
                ? item.studentId
                : Number(item.studentId) || 0,
            trainingSessionId:
              typeof item.trainingSessionId === "number"
                ? item.trainingSessionId
                : Number(item.trainingSessionId) || 0,
            courseName: item.courseName ?? "",
            totalLectures:
              typeof item.totalLectures === "number"
                ? item.totalLectures
                : Number(item.totalLectures) || 0,
            lecturesAttended:
              typeof item.lecturesAttended === "number"
                ? item.lecturesAttended
                : Number(item.lecturesAttended) || 0,
            image: item.image ?? "",
            startDate: item.startDate ?? "",
            attendancePercentage:
              typeof item.attendancePercentage === "number"
                ? item.attendancePercentage
                : Number(item.attendancePercentage) || 0,
          }))
        : [];

      return items;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiMessage =
          typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.message ||
              error.response?.data?.error ||
              "فشل تحميل نسبة الإكمال";
        return thunkAPI.rejectWithValue(apiMessage);
      }
      return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
  },
);

export default actFetchCompletionPercentage;
