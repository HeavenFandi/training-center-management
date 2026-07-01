import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";

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
  classroomId: number;
  teacherName: string;
  teacherId: number;
  instituteName?: string;
  tenantName?: string;
  location?: string;
  categoryName?: string;
  image?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
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
      console.log(`[DEBUG][STAGE 1: API REQUEST] Fetching active/upcoming sessions for course ${courseId}, institute ${instituteId}`);
      const response = await axiosClient.get(
        `/training-sessions/course/${courseId}/institute/${instituteId}/active-upcoming`
      );
      console.log(`[DEBUG][STAGE 2: RAW API RESPONSE] Full response:`, response);
      console.log(`[DEBUG][STAGE 2: RAW API RESPONSE] Data field:`, response.data);
      console.log(`[DEBUG][STAGE 2: RAW API RESPONSE] Data keys:`, Object.keys(response.data));

      
      let rawData: TTrainingSessionResponse[] = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (typeof response.data === "object" && response.data !== null) {
        if ("data" in response.data && Array.isArray(response.data.data)) {
          rawData = response.data.data;
        }
      }
      console.log(`[DEBUG][STAGE 3: RAW DATA PREPARED] Raw sessions to map:`, rawData);

      const mappedSessions: TTrainingSessionListItem[] = rawData.map((item: TTrainingSessionResponse, index: number) => {
        console.log(`[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item keys:`, Object.keys(item));
        console.log(`[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item:`, item);
        console.log(`[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item.teacherId:`, item.teacherId);
        console.log(`[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item.classroomId:`, item.classroomId);
        
        const mappedItem = {
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
          startDate: item.startDate,
          startTime: item.startTime,
          endTime: item.endTime,
          days: item.days,
          minSeats: item.minSeats,
          numberOfLectures: item.numberOfLectures,
          requiredEquipment: item.requiredEquipment,
          classroomName: item.classroomName,
          classroomId: item.classroomId,
        };

        console.log(`[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item:`, mappedItem);
        console.log(`[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item.teacherId:`, mappedItem.teacherId);
        console.log(`[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item.classroomId:`, mappedItem.classroomId);
        
        return mappedItem;
      });

      console.log(`[DEBUG][STAGE 6: FINAL MAPPED SESSIONS] All mapped sessions:`, mappedSessions);
      
      return mappedSessions;
    } catch (error) {
      console.error(`[DEBUG][STAGE ERROR] Error fetching sessions:`, error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetActiveOrUpcomingByCourseAndInstitute;
