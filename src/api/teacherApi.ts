import axiosClient from "./axiosClient";

export interface TeacherApiResponse {
  id: number;
  firstName?: string;
  lastName?: string;
  specialization?: string;
  certificates?: string;
  address?: string;
  cv?: string;
  experienceYears?: number;
  userId?: number;
  username?: string;
  email?: string;
  contactInfo?: string;
  image?: string | null;
  numberOfStudents?: number;
}

export interface TeacherCourseProgress {
  courseId: number;
  courseName: string;
  completedSessions: number;
  totalSessions: number;
  progressPercentage: number;
  numberOfStudents?: number;
}

export const getTeachers = async () => {
  const response = await axiosClient.get<TeacherApiResponse[]>(`teachers`);
  return response.data;
};

export const getTeacherById = async (id: string | number) => {
  const response = await axiosClient.get<TeacherApiResponse>(`teachers/${id}`);
  return response.data;
};

export const getTeacherCourseProgress = async (id: string | number) => {
  const response = await axiosClient.get<TeacherCourseProgress[]>(
    `teachers/${id}/course-progress`,
  );
  return response.data;
};
