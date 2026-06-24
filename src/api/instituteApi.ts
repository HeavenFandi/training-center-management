import axiosClient from "./axiosClient";

export type Institute = {
  id: number;
  userId?: number;
  tenantId?: any;
  name: string;
  workingHours: string;
  description: string;
  location: string;
  ownerName: string;
  email: string;
  contactInfo: string;
  tenantName: string;
  phoneNumber?: string;
  workingDays?: string[];
  startTime?: string;
  endTime?: string;
  status?: string;
};

export type UpdateInstituteRequest = {
  userId?: number;
  tenantId?: any;
  name: string;
  location: string;
  description: string;
  phoneNumber: string;
  email: string;
  startTime: string;
  endTime: string;
  workingDays: string[];
  status: "ACTIVE" | "INACTIVE";
};

export const getInstituteById = async (id: string | number) => {
  const response = await axiosClient.get<Institute>(`institutes/${id}`);
  return response.data;
};

export const getInstituteByTenantId = async (tenantId: string) => {
  const response = await axiosClient.get<Institute[]>(`institutes/tenant/${tenantId}`);
  return response.data;
};

export const getInstituteByUserId = async (userId: string | number) => {
  const response = await axiosClient.get<Institute | Institute[]>(`institutes/user/${userId}`);
  const raw = response.data;
  const institute = Array.isArray(raw)
    ? raw[0] ?? null
    : raw;
  return institute;
};

export const updateInstitute = async (id: number, data: UpdateInstituteRequest) => {
  const response = await axiosClient.put<Institute>(`institutes/${id}`, data);
  return response.data;
};

export type MonthlyRegistration = {
  month: number;
  registrations: number;
};

export const getInstituteMonthlyRegistrations = async (id: number | string, year: number) => {
  const response = await axiosClient.get<MonthlyRegistration[]>(`institutes/${id}/registration-monthly?year=${year}`);
  return response.data;
};

export const createInstitute = async (data: any) => {
  const response = await axiosClient.post<Institute>("institutes", data);
  return response.data;
};

export const getStudentsCount = async (tenantId: string | number) => {
  const response = await axiosClient.get<number>(`institutes/tenant/${tenantId}/students-count`);
  return response.data;
};
