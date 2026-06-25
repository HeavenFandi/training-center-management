import axiosClient from "./axiosClient";

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

export const createTrainingSession = async (
  data: CreateTrainingSessionRequest,
): Promise<TrainingSessionResponse> => {
  const response = await axiosClient.post<TrainingSessionResponse>(
    "/training-sessions",
    data,
  );
  return response.data;
};
