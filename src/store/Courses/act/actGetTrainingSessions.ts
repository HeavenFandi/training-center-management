import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";
import { RootState } from "../../index";

interface TTrainingSessionResponse {
  id: number;
  courseId?: number;
  courseName: string;
  courseDescription?: string;
  teacherName: string;
  teacherId?: number;
  duration: string;
  price: number;
  availableSeats: number;
  status: string;
  categoryName?: string;
  tenantName?: string;
  location?: string;
  instituteName?: string;
  classroomName?: string;
  image?: string;
  enrolledStudentsCount?: number;
}

const actGetTrainingSessions = createAsyncThunk(
  "trainingSessions/actGetTrainingSessions",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have training sessions data and fetch succeeded, don't fetch again
    if (state.trainingSessions.trainingSessions.length > 0 && state.trainingSessions.loading === "succeeded") {
      return state.trainingSessions.trainingSessions;
    }
    
    try {
      console.log("=== actGetTrainingSessions ===");
      console.log("Fetching all sessions without filters");
      const response = await axiosClient.get<TTrainingSessionResponse[]>("/training-sessions/sessions-with-filter");
      console.log("Raw API Response:", response.data);

      const mappedSessions: TTrainingSessionListItem[] = response.data.map((item: TTrainingSessionResponse, index: number) => {
        console.log(`Mapping session ${index}:`, item);
        const mapped = {
          id: item.id,
          courseId: item.courseId,
          title: item.courseName,
          teacherName: item.teacherName,
          teacherId: item.teacherId,
          duration: item.duration,
          price: item.price,
          availableSeats: item.availableSeats,
          status: item.status,
          category: item.categoryName || "", 
          institute: item.instituteName || item.tenantName || "",
          location: item.location || item.classroomName || "",
          image: item.image || "",
          description: item.courseDescription || "",
          enrolledStudentsCount: item.enrolledStudentsCount ?? (item as any).enrolledCount ?? (item as any).registeredStudentsCount ?? (item as any).studentsCount,
        };
        console.log("Mapped session:", mapped);
        return mapped;
      });

      console.log("All mapped sessions:", mappedSessions);
      return mappedSessions;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetTrainingSessions;
