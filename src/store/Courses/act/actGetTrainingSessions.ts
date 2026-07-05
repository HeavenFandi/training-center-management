import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";
import { RootState } from "../../index";
import { getAllInstitutes, Institute } from "../../../api/instituteApi";

interface TTrainingSessionResponse {
  id: number;
  courseId?: number;
  courseName: string;
  courseDescription?: string;
  teacherName: string;
  teacherId: number;
  duration: string;
  price: number;
  availableSeats: number;
  status: string;
  categoryName?: string;
  tenantName?: string;
  location?: string;
  instituteName?: string;
  classroomName?: string;
  classroomId: number;
  image?: string;
  enrolledStudentsCount?: number;
}

const actGetTrainingSessions = createAsyncThunk(
  "trainingSessions/actGetTrainingSessions",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;

    // If we already have training sessions data and fetch succeeded, don't fetch again
    if (
      state.trainingSessions.trainingSessions.length > 0 &&
      state.trainingSessions.loading === "succeeded"
    ) {
      return state.trainingSessions.trainingSessions;
    }

    try {
      console.log("=== actGetTrainingSessions ===");
      console.log("Fetching all sessions without filters");
      const [sessionsResponse, institutesResponse] = await Promise.all([
        axiosClient.get<TTrainingSessionResponse[]>(
          "/training-sessions/sessions-with-filter",
        ),
        getAllInstitutes(),
      ]);

      console.log("Raw API Response (sessions):", sessionsResponse.data);
      console.log("Raw API Response (institutes):", institutesResponse);

      // Create a map of institute names to their locations
      const instituteLocationMap = new Map<string, string>();
      institutesResponse.forEach((institute) => {
        if (institute.name) {
          instituteLocationMap.set(institute.name, institute.location);
        }
        if (institute.tenantName) {
          instituteLocationMap.set(institute.tenantName, institute.location);
        }
      });

      const mappedSessions: TTrainingSessionListItem[] =
        sessionsResponse.data.map(
          (item: TTrainingSessionResponse, index: number) => {
            console.log(`Mapping session ${index}:`, item);
            const instituteName = item.instituteName || item.tenantName || "";
            const instituteLocation =
              instituteLocationMap.get(instituteName) || "";

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
              institute: instituteName,
              location: instituteLocation,
              image: item.image || "",
              description: item.courseDescription || "",
              classroomId: item.classroomId,
              enrolledStudentsCount:
                item.enrolledStudentsCount ??
                (item as any).enrolledCount ??
                (item as any).registeredStudentsCount ??
                (item as any).studentsCount,
            };
            console.log("Mapped session:", mapped);
            return mapped;
          },
        );

      console.log("All mapped sessions:", mappedSessions);
      return mappedSessions;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetTrainingSessions;
