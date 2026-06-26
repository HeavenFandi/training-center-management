import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";

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

interface ActGetActiveOrUpcomingArgs {
  courseId: number;
  instituteId: number;
}

const actGetActiveOrUpcomingByCourseAndInstitute = createAsyncThunk(
  "trainingSessions/actGetActiveOrUpcomingByCourseAndInstitute",
  async ({ courseId, instituteId }: ActGetActiveOrUpcomingArgs, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log(`[DEBUG] Fetching active/upcoming sessions for course ${courseId}, institute ${instituteId}`);
      const response = await axiosClient.get(
        `/training-sessions/course/${courseId}/institute/${instituteId}/active-upcoming`
      );
      console.log("[DEBUG] Active/upcoming response full:", response);
      console.log("[DEBUG] Active/upcoming response data:", response.data);

      
      let rawData: TTrainingSessionResponse[] = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (typeof response.data === "object" && response.data !== null) {
        if ("data" in response.data && Array.isArray(response.data.data)) {
          rawData = response.data.data;
        }
      }
      console.log("[DEBUG] Raw sessions data to map:", rawData);

      const mappedSessions: TTrainingSessionListItem[] = rawData.map((item: TTrainingSessionResponse) => ({
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

export default actGetActiveOrUpcomingByCourseAndInstitute;
