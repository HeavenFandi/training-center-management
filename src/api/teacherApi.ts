import axiosClient from "./axiosClient";

export interface CreateTeacherRequest {
  userId: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  firstName: string;
  lastName: string;
  specialization: string;
  certificates?: string;
  address: string;
  cv?: string;
  experienceYears: number;
}

export interface UpdateTeacherRequest {
  userId: number;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  firstName: string;
  lastName: string;
  specialization: string;
  certificates: string;
  address: string;
  cv: string;
  experienceYears: number;
}

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

export const createTeacher = async (
  data: CreateTeacherRequest
): Promise<TeacherApiResponse> => {
  const response = await axiosClient.post<TeacherApiResponse>("/teachers", data);
  return response.data;
};

export const updateTeacher = async (
  id: number,
  data: UpdateTeacherRequest
): Promise<TeacherApiResponse> => {
  const response = await axiosClient.put<TeacherApiResponse>(`/teachers/${id}`, data);
  return response.data;
};

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

export const deleteTeacher = async (id: number): Promise<void> => {
  await axiosClient.delete(`/teachers/${id}`);
};

export const updateTeacherProfileImage = async (
  id: number,
  file: File
): Promise<TeacherApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.put<TeacherApiResponse>(`/teachers/${id}/profile-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
