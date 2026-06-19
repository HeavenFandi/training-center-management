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
}

export interface ActiveCourse {
  id: number;
  title: string;
  lessons: string;
  hoursLeft: string;
  progress: number;
  image: string;
}

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface WeeklyScheduleItem {
  day: string;
  courseName: string;
  startTime: TimeObject;
  endTime: TimeObject;
  teacherName: string;
  room: string;
}

