export interface Student {
  id: number;
  username: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  contactInfo?: string;
  image?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  address?: string;
  interest?: string;
  bio?: string;
  enrollmentDate?: string;
  userId?: number;
}

export interface Lecture {
  title: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
}

export interface Day {
  name: string;
  date: number;
  dateString: string; // ISO date string like '2026-07-01'
  fullDate: Date;
}

export interface ActiveCourse {
  studentId: number;
  trainingSessionId: number;
  courseName: string;
  totalLectures: number;
  lecturesAttended: number;
  image: string;
  startDate: string | null;
  attendancePercentage: number;
}

export interface CompletionPercentageItem {
  studentId: number;
  trainingSessionId: number;
  courseName: string;
  totalLectures: number;
  lecturesAttended: number;
  image?: string;
  startDate?: string;
  attendancePercentage: number;
}

export interface StudentTrainingHours {
  studentId: number;
  totalHours: number;
}

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface WeeklyScheduleItem {
  day: string;
  lectureDate: string;
  courseName: string;
  startTime: TimeObject;
  endTime: TimeObject;
  teacherName: string;
  room: string;
}
