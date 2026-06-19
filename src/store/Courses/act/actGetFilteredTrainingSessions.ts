import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";

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
      const response = await axiosClient.get<TTrainingSessionResponse[]>("/training-sessions/sessions-with-filter", {
        params: cleanedFilters,
      });
      console.log("Filtered response:", response.data);

      const mappedSessions: TTrainingSessionListItem[] = response.data.map((item: TTrainingSessionResponse) => ({
        id: item.id,
        title: item.courseName,
        teacherName: item.teacherName,
        duration: item.duration,
        price: item.price,
        availableSeats: item.availableSeats,
        status: item.status,
        category: item.categoryName || "", 
        institute: item.instituteName || item.tenantName || "",
        location: item.location || item.classroomName || "",
        image: item.image || "",
      }));

      return mappedSessions;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetFilteredTrainingSessions;
