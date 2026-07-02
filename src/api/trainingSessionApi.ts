import axiosClient from "./axiosClient";

export type TimeObject = {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
};

export const convertTimeStringToTimeObject = (
  timeStr: string,
): { hour: number; minute: number; second: number; nano: 0 } => {
  // Accepts "HH:mm" or "HH:mm:ss"
  const parts = timeStr.split(":").map(Number);
  const hour = parts[0] || 0;
  const minute = parts[1] || 0;
  const second = parts[2] || 0;
  return { hour, minute, second, nano: 0 };
};

export const convertTimeObjectToString = (
  timeObj: TimeObject | string,
): string => {
  // If it's already a string, just ensure it's in "HH:mm:ss" format
  if (typeof timeObj === "string") {
    const parts = timeObj.split(":");
    const hour = parts[0]?.padStart(2, "0") || "00";
    const minute = parts[1]?.padStart(2, "0") || "00";
    const second = parts[2]?.padStart(2, "0") || "00";
    return `${hour}:${minute}:${second}`;
  }
  // Convert TimeObject to "HH:mm:ss"
  const hour = timeObj.hour.toString().padStart(2, "0");
  const minute = timeObj.minute.toString().padStart(2, "0");
  const second = (timeObj.second || 0).toString().padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

export type CreateLectureRequest = {
  lectureDate: string;
  startTime: string;
  endTime: string;
  classroomId: number;
  teacherId: number;
  sessionId: number;
};

export type CreateTrainingSessionRequest = {
  price: number;
  availableSeats: number;
  minSeats: number;
  numberOfLectures: number;
  requiredEquipment: string;
  duration: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  courseId: number;
  classroomId: number;
  teacherId: number;
  startDate: string;
  startTime: string | TimeObject;
  endTime: string | TimeObject;
  daysOfWeek: Array<
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
  >;
};

export type UpdateTrainingSessionRequest =
  Partial<CreateTrainingSessionRequest>;

export type TrainingSessionResponse = {
  id: number;
  price: number;
  availableSeats: number;
  minSeats: number;
  numberOfLectures: number;
  requiredEquipment: string;
  duration: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  courseId: number;
  courseName: string;
  courseDescription: string;
  classroomName: string;
  classroomId: number;
  teacherName: string;
  teacherId: number;
  instituteName: string;
  instituteId: number;
  image: string;
  studentEnrollmentCount?: number;
  startDate?: string;
  startTime?: TimeObject;
  endTime?: TimeObject;
  daysOfWeek?: string[];
};

export type LectureResponse = {
  id: number;
  lectureDate: string;
  startTime: TimeObject;
  endTime: TimeObject;
  sessionName: string;
  classroomNumber: string;
  teacherName: string;
  classroomId?: number;
  teacherId?: number;
  sessionId?: number;
};

export type UpdateLectureRequest = {
  sessionName?: string;
  lectureDate?: string;
  startTime?: string;
  endTime?: string;
  classroomId?: number;
  teacherId?: number;
  sessionId?: number;
};

// Helper to convert response time fields to TimeObject
const convertSessionResponseTimeFields = (
  session: any,
): TrainingSessionResponse => {
  const converted = { ...session };

  if (typeof converted.startTime === "string") {
    converted.startTime = convertTimeStringToTimeObject(converted.startTime);
  }

  if (typeof converted.endTime === "string") {
    converted.endTime = convertTimeStringToTimeObject(converted.endTime);
  }

  return converted;
};

export const createTrainingSession = async (
  data: CreateTrainingSessionRequest,
): Promise<TrainingSessionResponse> => {
  console.log(
    "[DEBUG createTrainingSession] Data received from frontend:",
    data,
  );

  // Convert time fields to "HH:mm:ss" strings
  const payload = { ...data };
  if (payload.startTime) {
    payload.startTime = convertTimeObjectToString(payload.startTime);
  }
  if (payload.endTime) {
    payload.endTime = convertTimeObjectToString(payload.endTime);
  }

  console.log(
    "[DEBUG createTrainingSession] Final payload being sent:",
    payload,
  );
  const response = await axiosClient.post<TrainingSessionResponse>(
    "/training-sessions",
    payload,
  );
  console.log("[DEBUG createTrainingSession] Backend response:", response);
  return convertSessionResponseTimeFields(response.data);
};

export const updateTrainingSession = async (
  id: number,
  data: UpdateTrainingSessionRequest,
): Promise<TrainingSessionResponse> => {
  console.log("[DEBUG updateTrainingSession] id:", id);
  console.log(
    "[DEBUG updateTrainingSession] Data received from frontend:",
    data,
  );

  // Convert time fields to "HH:mm:ss" strings
  const payload = { ...data };
  if (payload.startTime) {
    payload.startTime = convertTimeObjectToString(payload.startTime);
  }
  if (payload.endTime) {
    payload.endTime = convertTimeObjectToString(payload.endTime);
  }

  console.log(
    "[DEBUG updateTrainingSession] Final payload being sent:",
    payload,
  );
  const response = await axiosClient.put<TrainingSessionResponse>(
    `/training-sessions/${id}`,
    payload,
  );
  console.log("[DEBUG updateTrainingSession] Backend response:", response);
  return convertSessionResponseTimeFields(response.data);
};

export const updateTrainingSessionImage = async (
  id: number,
  imageFile: File,
): Promise<TrainingSessionResponse> => {
  const formData = new FormData();
  formData.append("file", imageFile);
  const response = await axiosClient.put<TrainingSessionResponse>(
    `/training-sessions/${id}/image`,
    formData,
  );
  return response.data;
};

export const getTopEnrolledTrainingSessions = async (): Promise<
  TrainingSessionResponse[]
> => {
  const response = await axiosClient.get<TrainingSessionResponse[]>(
    "/training-sessions/top-enrolled",
  );
  return response.data;
};

// Helper to convert response time fields to TimeObject
const convertLectureResponseTimeFields = (lecture: any): LectureResponse => {
  const converted = { ...lecture };

  if (typeof converted.startTime === "string") {
    converted.startTime = convertTimeStringToTimeObject(converted.startTime);
  }

  if (typeof converted.endTime === "string") {
    converted.endTime = convertTimeStringToTimeObject(converted.endTime);
  }

  return converted;
};

export const createLecture = async (
  sessionId: number,
  data: any,
): Promise<LectureResponse> => {
  console.log("sessionId:", sessionId);
  console.log("URL:", `/lectures/session/${sessionId}`);

  // Convert time fields to "HH:mm:ss" strings
  const payload = { ...data };
  if (payload.startTime) {
    payload.startTime = convertTimeObjectToString(payload.startTime);
  }
  if (payload.endTime) {
    payload.endTime = convertTimeObjectToString(payload.endTime);
  }

  console.log("Payload:", payload);
  const response = await axiosClient.post<LectureResponse>(
    `/lectures/session/${sessionId}`,
    payload,
  );
  const converted = convertLectureResponseTimeFields(response.data);
  // Ensure sessionId is present in the response
  if (!converted.sessionId) {
    converted.sessionId = sessionId;
  }
  return converted;
};

export const getLecturesBySessionId = async (
  sessionId: number,
): Promise<LectureResponse[]> => {
  const response = await axiosClient.get<LectureResponse[]>(
    `/lectures/session/${sessionId}`,
  );
  return response.data.map(convertLectureResponseTimeFields);
};

export const updateLecture = async (
  id: number,
  data: any,
): Promise<LectureResponse> => {
  console.log("[DEBUG updateLecture] Data received from frontend:", data);

  // Convert time fields to "HH:mm:ss" strings
  const payload = { ...data };
  if (payload.startTime) {
    payload.startTime = convertTimeObjectToString(payload.startTime);
  }
  if (payload.endTime) {
    payload.endTime = convertTimeObjectToString(payload.endTime);
  }

  console.log("[DEBUG updateLecture] Payload being sent to API:", payload);

  const response = await axiosClient.put<LectureResponse>(
    `/lectures/${id}`,
    payload,
  );
  const converted = convertLectureResponseTimeFields(response.data);
  // Ensure sessionId is present in the response, use payload's sessionId as fallback
  if (!converted.sessionId && payload.sessionId) {
    converted.sessionId = payload.sessionId;
  }
  return converted;
};

export const deleteLecture = async (id: number): Promise<void> => {
  await axiosClient.delete(`/lectures/${id}`);
};

export const deleteTrainingSession = async (id: number): Promise<void> => {
  await axiosClient.delete(`/training-sessions/${id}`);
};

export const getAllLectures = async (): Promise<LectureResponse[]> => {
  const response = await axiosClient.get<LectureResponse[]>("/lectures");
  return response.data.map(convertLectureResponseTimeFields);
};
