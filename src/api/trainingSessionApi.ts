import axiosClient from "./axiosClient";

export type TimeObject = {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
};

export type CreateLectureRequest = {
  sessionName: string;
  lectureDate: string;
  startTime: string; // LocalTime format "HH:mm:ss"
  endTime: string; // LocalTime format "HH:mm:ss"
  classroomId: number;
  teacherId: number;
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
  startTime: string; // LocalTime format "HH:mm:ss"
  endTime: string; // LocalTime format "HH:mm:ss"
  daysOfWeek: Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY">;
};

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
  teacherName: string;
  teacherId: number;
  instituteName: string;
  instituteId: number;
  image: string;
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
  startTime?: string; // LocalTime format "HH:mm:ss"
  endTime?: string; // LocalTime format "HH:mm:ss"
  classroomId?: number;
  teacherId?: number;
  sessionId: number;
};

export const createTrainingSession = async (
  data: CreateTrainingSessionRequest,
): Promise<TrainingSessionResponse> => {
  const response = await axiosClient.post<TrainingSessionResponse>(
    "/training-sessions",
    data,
  );
  return response.data;
};

export const createLecture = async (
  sessionId: number,
  data: CreateLectureRequest,
): Promise<LectureResponse> => {
  console.log("sessionId:", sessionId);
  console.log("URL:", `/api/lectures/session/${sessionId}`);
  console.log("Payload:", data);
  const response = await axiosClient.post<LectureResponse>(
    `/lectures/session/${sessionId}`,
    data,
  );
  return response.data;
};

export const getLecturesBySessionId = async (
  sessionId: number,
): Promise<LectureResponse[]> => {
  const response = await axiosClient.get<LectureResponse[]>(
    `/lectures/session/${sessionId}`,
  );
  return response.data;
};

export const updateLecture = async (
  id: number,
  data: UpdateLectureRequest,
): Promise<LectureResponse> => {
  console.log("[DEBUG updateLecture] Data received from frontend:", data);
  
  console.log("[DEBUG updateLecture] Payload being sent to API:", data);
  
  const response = await axiosClient.put<LectureResponse>(
    `/lectures/${id}`,
    data,
  );
  return response.data;
};

export const deleteLecture = async (
  id: number,
): Promise<void> => {
  await axiosClient.delete(`/lectures/${id}`);
};

export const deleteTrainingSession = async (
  id: number,
): Promise<void> => {
  await axiosClient.delete(`/training-sessions/${id}`);
};
