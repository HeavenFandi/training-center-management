import axiosClient from "./axiosClient";
import { TCourse } from "../types/cardType";

export interface CreateCourseRequest {
  name: string;
  description: string;
  requirements: string;
  hours: number;
  categoryId: number;
  tenantId: number;
}

export interface CreateCourseResponse extends TCourse {}

export interface UpdateCourseRequest {
  id: number;
  name: string;
  description: string;
  requirements: string;
  hours: number;
  categoryId: number;
  tenantId: number;
}

export interface UpdateCourseResponse extends TCourse {}

export interface SearchCourseResponse {
  id: number;
  name: string;
  description: string;
  requirements: string;
  hours: number;
  categoryName: string;
  tenantName: string;
}

export const getCoursesByTenantId = async (tenantId: string): Promise<TCourse[]> => {
  const response = await axiosClient.get<TCourse[]>(`/courses/tenant/${tenantId}`);
  return response.data;
};

export const searchCourses = async (name: string, tenantId: number): Promise<SearchCourseResponse[]> => {
  const response = await axiosClient.get<SearchCourseResponse[]>("/courses/search", {
    params: { name, tenantId }
  });
  return response.data;
};

export const createCourse = async (data: CreateCourseRequest): Promise<CreateCourseResponse> => {
  const response = await axiosClient.post<CreateCourseResponse>("/courses", data);
  return response.data;
};

export const updateCourse = async (data: UpdateCourseRequest): Promise<UpdateCourseResponse> => {
  const response = await axiosClient.put<UpdateCourseResponse>(`/courses/${data.id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axiosClient.delete(`/courses/${id}`);
};
