import axiosClient from "./axiosClient";

export type Classroom = {
  id: number;
  number: string;
  capacity: number;
  availableDevices: string;
  images: string | null;
  instituteId: number;
  instituteName: string;
};

export type UpdateClassroomRequest = {
  number: string;
  capacity: number;
  availableDevices: string;
  images?: string | null;
  instituteId: number;
};

export type CreateClassroomRequest = {
  number: string;
  capacity: number;
  availableDevices: string;
  images?: string | null;
  instituteId: number;
};

export const getClassroomsByInstituteId = async (instituteId: number) => {
  const response = await axiosClient.get<Classroom[]>(`classrooms/institute/${instituteId}`);
  return response.data;
};

export const updateClassroom = async (id: number, data: UpdateClassroomRequest) => {
  const response = await axiosClient.put<Classroom>(`classrooms/${id}`, data);
  return response.data;
};

export const createClassroom = async (data: CreateClassroomRequest) => {
  const response = await axiosClient.post<Classroom>("classrooms", data);
  return response.data;
};

export const deleteClassroom = async (id: number) => {
  const response = await axiosClient.delete(`classrooms/${id}`);
  return response.data;
};
