import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";
import { getAllInstitutes } from "../../../api/instituteApi";

export interface TFilters {
  category?: string;
  instituteName?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  address?: string; // Adding address as an alias for location
}

interface TTrainingSessionResponse {
  id: number;
  courseId?: number;
  price: number;
  availableSeats: number;
  minSeats: number;
  numberOfLectures: number;
  requiredEquipment: string;
  duration: string;
  status: string;
  courseName: string;
  courseDescription: string;
  classroomName?: string;
  teacherName: string;
  teacherId?: number;
  instituteName?: string;
  tenantName?: string;
  location?: string;
  categoryName?: string;
  image?: string;
}

const actGetFilteredTrainingSessions = createAsyncThunk(
  "trainingSessions/actGetFilteredTrainingSessions",
  async (filters: TFilters, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // Filter out empty/undefined parameters
      const cleanedFilters: Record<string, any> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          cleanedFilters[key] = value;
        }
      });

      console.log("Fetching sessions with filters:", cleanedFilters);
      const [sessionsResponse, institutesResponse] = await Promise.all([
        axiosClient.get<TTrainingSessionResponse[]>(
          "/training-sessions/sessions-with-filter",
          {
            params: cleanedFilters,
          },
        ),
        getAllInstitutes(),
      ]);

      console.log("Filtered response (sessions):", sessionsResponse.data);
      console.log("Filtered response (institutes):", institutesResponse);

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
        sessionsResponse.data.map((item: TTrainingSessionResponse) => {
          const instituteName = item.instituteName || item.tenantName || "";
          const instituteLocation =
            instituteLocationMap.get(instituteName) || "";

          return {
            id: item.id,
            courseId: item.courseId,
            title: item.courseName,
            teacherName: item.teacherName,
            teacherId: item.teacherId || 0,
            duration: item.duration,
            price: item.price,
            availableSeats: item.availableSeats,
            status: item.status,
            category: item.categoryName || "",
            institute: instituteName,
            location: instituteLocation,
            image: item.image || "",
            description: item.courseDescription || "",
            classroomId: (item as any).classroomId,
            minSeats: item.minSeats,
            numberOfLectures: item.numberOfLectures,
            requiredEquipment: item.requiredEquipment,
            startDate: (item as any).startDate,
            startTime: (item as any).startTime,
            endTime: (item as any).endTime,
          };
        });

      return mappedSessions;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetFilteredTrainingSessions;
