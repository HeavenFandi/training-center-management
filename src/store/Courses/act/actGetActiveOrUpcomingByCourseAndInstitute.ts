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
      const [sessionsResponse, institute, teachersResponse] = await Promise.all(
        [
          axiosClient.get(
            `/training-sessions/course/${courseId}/institute/${instituteId}/active-upcoming`,
          ),
          getInstituteById(instituteId),
          getTeachers(),
        ],
      );

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

          return mappedItem;
        },
      );

      return mappedSessions;
    } catch (error) {
      console.error(`[DEBUG][STAGE ERROR] Error fetching sessions:`, error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetActiveOrUpcomingByCourseAndInstitute;
