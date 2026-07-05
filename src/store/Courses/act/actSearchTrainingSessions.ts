import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionListItem } from "../../../types/cardType";
import { getTeachers } from "../../../api/teacherApi";

interface TTrainingSessionResponse {
  id: number;
  courseId?: number;
  courseName: string;
  courseDescription?: string;
  teacherName: string;
  teacherUsername?: string;
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
}

const actSearchTrainingSessions = createAsyncThunk(
  "trainingSessions/actSearchTrainingSessions",
  async (searchTerm: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const [response, teachersResponse] = await Promise.all([
        axiosClient.get<TTrainingSessionResponse[]>(
          "/training-sessions/search/by-name",
          {
            params: {
              name: searchTerm,
            },
          },
        ),
        getTeachers(),
      ]);

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

      const mappedSessions: TTrainingSessionListItem[] = response.data.map(
        (item: TTrainingSessionResponse) => {
          const teacherId = item.teacherId || 0;
          const finalTeacherName =
            teacherNameMap.get(teacherId) ||
            item.teacherName ||
            item.teacherUsername ||
            "";

          return {
            id: item.id,
            courseId: item.courseId,
            title: item.courseName,
            teacherName: finalTeacherName,
            teacherId: teacherId,
            duration: item.duration,
            price: item.price,
            availableSeats: item.availableSeats,
            status: item.status,
            category: item.categoryName || "",
            institute: item.instituteName || item.tenantName || "",
            location: item.location || item.classroomName || "",
            image: item.image || "",
            description: item.courseDescription || "",
            classroomId: (item as any).classroomId,
          };
        },
      );

      return mappedSessions;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actSearchTrainingSessions;
