import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";

interface TTrainingSessionResponse {
  id: number;
  courseName: string;
  teacherName: string;
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
}

const actGetTrainingSessions = createAsyncThunk(
  "trainingSessions/actGetTrainingSessions",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Fetching all sessions without filters");
      const response = await axiosClient.get<TTrainingSessionResponse[]>("/training-sessions/sessions-with-filter");
      console.log("Response:", response.data);
  
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
  },
);

export default actGetTrainingSessions;
