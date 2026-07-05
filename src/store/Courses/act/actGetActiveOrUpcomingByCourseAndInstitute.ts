import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";
import { getInstituteById } from "../../../api/instituteApi";
import { getTeachers } from "../../../api/teacherApi";

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
  teacherName?: string;
  teacherUsername?: string;
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
      console.log(
        `[DEBUG][STAGE 1: API REQUEST] Fetching active/upcoming sessions for course ${courseId}, institute ${instituteId}`,
      );
      const [sessionsResponse, institute, teachersResponse] = await Promise.all(
        [
          axiosClient.get(
            `/training-sessions/course/${courseId}/institute/${instituteId}/active-upcoming`,
          ),
          getInstituteById(instituteId),
          getTeachers(),
        ],
      );
      console.log(
        `[DEBUG][STAGE 2: RAW API RESPONSE] Full response:`,
        sessionsResponse,
      );
      console.log(
        `[DEBUG][STAGE 2: RAW API RESPONSE] Data field:`,
        sessionsResponse.data,
      );
      console.log(
        `[DEBUG][STAGE 2: RAW API RESPONSE] Data keys:`,
        Object.keys(sessionsResponse.data),
      );
      console.log(`[DEBUG][STAGE 2: INSTITUTE DATA]`, institute);
      console.log(`[DEBUG][STAGE 2: TEACHERS DATA]`, teachersResponse);

      let rawData: TTrainingSessionResponse[] = [];
      if (Array.isArray(sessionsResponse.data)) {
        rawData = sessionsResponse.data;
      } else if (
        typeof sessionsResponse.data === "object" &&
        sessionsResponse.data !== null
      ) {
        if (
          "data" in sessionsResponse.data &&
          Array.isArray(sessionsResponse.data.data)
        ) {
          rawData = sessionsResponse.data.data;
        }
      }
      console.log(
        `[DEBUG][STAGE 3: RAW DATA PREPARED] Raw sessions to map:`,
        rawData,
      );

      // Create a map of teacherId to full name
      const teacherNameMap = new Map<number, string>();
      teachersResponse.forEach((teacher) => {
        if (teacher.id) {
          const fullName =
            `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
          if (fullName) {
            teacherNameMap.set(teacher.id, fullName);
          }
        }
      });

      const mappedSessions: TTrainingSessionListItem[] = rawData.map(
        (item: TTrainingSessionResponse, index: number) => {
          console.log(
            `[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item keys:`,
            Object.keys(item),
          );
          console.log(
            `[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item:`,
            item,
          );
          console.log(
            `[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item.teacherId:`,
            item.teacherId,
          );
          console.log(
            `[DEBUG][STAGE 4: MAPPING ITEM ${index}] Raw item.classroomId:`,
            item.classroomId,
          );

          // Get teacher name from map if available, otherwise fall back to API fields
          const finalTeacherName =
            teacherNameMap.get(item.teacherId) ||
            item.teacherName ||
            item.teacherUsername ||
            "";

          const mappedItem = {
            id: item.id,
            courseId: item.courseId,
            title: item.courseName,
            teacherName: finalTeacherName,
            teacherId: item.teacherId,
            duration: item.duration,
            price: item.price,
            availableSeats: item.availableSeats,
            status: item.status,
            category: item.categoryName || "",
            institute: item.instituteName || item.tenantName || "",
            location: institute.location,
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

          console.log(
            `[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item:`,
            mappedItem,
          );
          console.log(
            `[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item.teacherId:`,
            mappedItem.teacherId,
          );
          console.log(
            `[DEBUG][STAGE 5: MAPPED ITEM ${index}] Mapped item.classroomId:`,
            mappedItem.classroomId,
          );

          return mappedItem;
        },
      );

      console.log(
        `[DEBUG][STAGE 6: FINAL MAPPED SESSIONS] All mapped sessions:`,
        mappedSessions,
      );

      return mappedSessions;
    } catch (error) {
      console.error(`[DEBUG][STAGE ERROR] Error fetching sessions:`, error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetActiveOrUpcomingByCourseAndInstitute;
