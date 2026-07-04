import axiosClient from "./axiosClient";
import { ApiTimeObject } from "../utils/timeUtils";

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
  startTime?: string | ApiTimeObject;
  endTime?: string | ApiTimeObject;
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

export type UpdateInstituteApiRequest = {
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
  const response = await axiosClient.get<Institute>(`/institutes/${id}`);
  return response.data;
};

export const getInstituteByTenantId = async (tenantId: string) => {
  const response = await axiosClient.get<Institute[]>(`/institutes/tenant/${tenantId}`);
  return response.data;
};

export const getInstituteByUserId = async (userId: string | number): Promise<Institute | null> => {
  const response = await axiosClient.get<Institute[]>(`/institutes/user/${userId}`);
  
  // Dev-only log to verify API response shape
  if (import.meta.env.DEV) {
    console.group("🔍 Institute API Response");
    console.log("Full response:", response);
    console.log("Response data (array):", response.data);
    console.groupEnd();
  }

  // ALWAYS treat as array (fallback to empty array for safety)
  const institutes = Array.isArray(response.data) ? response.data : [];
  
  // Return first valid institute (must have id), else null
  const validInstitute = institutes.find(
    (inst) => inst && typeof inst === "object" && "id" in inst
  );
  
  return validInstitute || null;
};

export const updateInstitute = async (id: number, data: UpdateInstituteRequest) => {
  const { formatTimeToHHmmss } = await import("../utils/timeUtils");
  const apiPayload = {
    ...data,
    startTime: formatTimeToHHmmss(data.startTime),
    endTime: formatTimeToHHmmss(data.endTime),
    workingDays: data.workingDays.map(day => day.toUpperCase()),
  };
  const response = await axiosClient.put<Institute>(`/institutes/${id}`, apiPayload);
  return response.data;
};

export type MonthlyRegistration = {
  month: number;
  registrations: number;
};

export const getInstituteMonthlyRegistrations = async (id: number | string, year: number) => {
  const response = await axiosClient.get<MonthlyRegistration[]>(`/institutes/${id}/registration-monthly?year=${year}`);
  return response.data;
};

export type FinancialMonthly = {
  month: number;
  totalRevenue: number;
  totalPayments: number;
};

export const getInstituteFinancialMonthly = async (id: number | string, year?: number) => {
  const params = year ? { year } : {};
  const response = await axiosClient.get<FinancialMonthly[]>(`/institutes/${id}/financial-monthly`, { params });
  return response.data;
};

export const createInstitute = async (data: any) => {
  const response = await axiosClient.post<Institute>("/institutes", data);
  return response.data;
};

export const getStudentsCount = async (tenantId: string | number) => {
  const response = await axiosClient.get<number>(`/institutes/tenant/${tenantId}/students-count`);
  return response.data;
};

export const getInstituteUsersCount = async (id: string | number) => {
  const response = await axiosClient.get<number>(`/institutes/${id}/users/count`);
  return response.data;
};

export const getAllInstitutes = async () => {
  const response = await axiosClient.get<Institute[]>("/institutes");
  return response.data;
};
