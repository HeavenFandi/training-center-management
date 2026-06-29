export interface TCourseData {
  name: string;
  description: string;
  img?: string;
  Statistics: {
    hours: string;
    lessons: string;
    students: string;
  };
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: "available" | "busy";
}

export interface TCourseListItem {
  id: number;
  title?: string;
  name?: string;
  institute: string;
  price: number;
  category?: string;
  categoryName?: string;
  location?: string;
  image?: string;
}

export interface TTrainingSessionListItem {
  id: number;
  courseId?: number;
  title: string;
  teacherName: string;
  teacherId?: number;
  duration: string;
  price: number;
  availableSeats: number;
  status: string;
  category: string;
  institute: string;
  location: string;
  image: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  minSeats?: number;
  numberOfLectures?: number;
  requiredEquipment?: string;
  classroomName?: string;
  enrolledStudentsCount?: number;
}

export interface TTrainingSessionDetails {
  id: number;
  courseId?: number;
  price: number;
  availableSeats: number;
  minSeats: number;
  numberOfLectures: number;
  requiredEquipment: string;
  duration: string;
  status: string;
  courseName: string;
  courseDescription: string;
  classroomName: string;
  teacherName: string;
  instituteName: string;
  image: string;
  instructor?: TInstructor;
  reviews?: TReview[];
  enrolledStudentsCount?: number;
}
export interface TReview {
  courseName?: string;
  username?: string;
  rating?: number | null;
  review?: string;
  id?: number;
  role?: string;
  image?: string;
  text?: string;
  name?: string;
}
export interface TInstructor {
  id?: number;
  teacherId?: number;
  instructorId?: number;
  lecturerId?: number;
  userId?: number;
  name: string;
  title: string;
  image: string;
  email: string;
  phone: string;
  certificates: string[];
  studentsCount: number;
  courseCount: number;
  experienceYears: number;
  rating: number;
  bio: string;
}
export interface TLecture {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface TSession {
  id: number;
  title: string;
  courseId: number;
  instructorId: number;
  semester: string;
  price: number;
  availableSeats: number;
  minCapacity: number;
  sessionsCount: number;
  duration: string;
  status: "نشطة" | "مكتملة" | "قيد الانتظار";
  requiredEquipment: string;
  startDate: string;
  startTime: string;
  endDate: string;
  days: string[];
  hall: string;
  image?: string;
  lectures: TLecture[];
  date?: string;
  time?: string;
  teacherName?: string;
}

export type TSuggestionType = "ROOM_SWAP" | "SERIES_SHIFT" | "PARTIAL";

export interface TRoomSuggestion {
  suggestionType: TSuggestionType;
  roomId: number;
  roomNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
}

export interface TCourse extends TCourseListItem {
  description: string;
  lecturesCount: number;
  instructor: TInstructor;
  reviews: TReview[];
  requirements: string;
  hours: number;
  categoryName: string;
  students: string;
  sessions?: TSession[];
  image: string;
  duration?: string;
  status?: string;
}
