import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { TTrainingSessionDetails } from "../../../types/cardType";

interface TTrainingSessionResponse {
  id: number;
  courseId?: number;
  trainingCourseId?: number;
  course?: {
    id?: number;
    courseId?: number;
  };
  courseDetails?: {
    id?: number;
    courseId?: number;
  };
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
  enrolledStudentsCount?: number;
  studentEnrollmentCount?: number;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: string[];
  days?: string[];
  classroomId?: number;
  hallId?: number;

  // Enrollment status properties
  isEnrolled?: boolean;
  isRegistered?: boolean;
  enrolledStudentIds?: number[];

  // مهم: ضفنا هدول لأن الباك ممكن يرجع id المعلم بأحد هالأسماء
  teacherId?: number;
  instructorId?: number;
  lecturerId?: number;
  userId?: number;

  instructor?: {
    id?: number;
    teacherId?: number;
    instructorId?: number;
    lecturerId?: number;
    userId?: number;
    name?: string;
    title?: string;
    image?: string;
    email?: string;
    phone?: string;
    certificates?: string[];
    studentsCount?: number;
    courseCount?: number;
    experienceYears?: number;
    rating?: number;
    bio?: string;
  };
}

const actGetTrainingSessionDetails = createAsyncThunk(
  "trainingSessions/actGetTrainingSessionDetails",
  async (id: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axiosClient.get<TTrainingSessionResponse>(
        `/training-sessions/${id}`,
      );

      const item = response.data;

      console.log(
        "RAW TRAINING SESSION DETAILS (full):",
        JSON.stringify(item, null, 2),
      );
      console.log("RAW TRAINING SESSION DETAILS (object):", item);
      console.log("All keys in response object:", Object.keys(item));
      console.log(
        "enrolledStudentsCount from backend:",
        item.enrolledStudentsCount,
      );
      console.log(
        "studentEnrollmentCount from backend:",
        item.studentEnrollmentCount,
      );

      // Parse duration to extract numeric part if it's a messy string
      let parsedDuration = item.duration;
      let parsedLectures = item.numberOfLectures;

      // Extract numbers from duration string (handles cases like "12 days for 40 lectures")
      const numbers = item.duration.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        // Try to extract days first
        if (numbers.length >= 1) {
          parsedDuration = numbers[0];
        }
        // If there are more numbers, maybe extract lectures
        if (numbers.length >= 2 && (!parsedLectures || parsedLectures === 0)) {
          parsedLectures = parseInt(numbers[1], 10);
        }
      }

      console.log("Parsed Duration:", parsedDuration);
      console.log("Parsed Lectures:", parsedLectures);

      const instructorId =
        item.instructor?.id && item.instructor.id !== 0
          ? item.instructor.id
          : (item.instructor?.teacherId ??
            item.instructor?.instructorId ??
            item.instructor?.lecturerId ??
            item.instructor?.userId ??
            item.teacherId ??
            item.instructorId ??
            item.lecturerId ??
            item.userId);

      console.log("FINAL MAPPED INSTRUCTOR ID:", instructorId);

      // Extract courseId from all possible places and normalize to a valid positive number
      const possibleCourseIds = [
        item.courseId,
        item.trainingCourseId,
        item.course?.id,
        item.course?.courseId,
        item.courseDetails?.id,
        item.courseDetails?.courseId,
      ];

      const extractedCourseId = possibleCourseIds.find(
        (value) =>
          typeof value === "number" && Number.isFinite(value) && value > 0,
      );

      console.log("EXTRACTING COURSE ID - item.courseId:", item.courseId);
      console.log(
        "EXTRACTING COURSE ID - item.trainingCourseId:",
        item.trainingCourseId,
      );
      console.log("EXTRACTING COURSE ID - item.course?.id:", item.course?.id);
      console.log(
        "EXTRACTING COURSE ID - item.course?.courseId:",
        item.course?.courseId,
      );
      console.log(
        "EXTRACTING COURSE ID - item.courseDetails?.id:",
        item.courseDetails?.id,
      );
      console.log(
        "EXTRACTING COURSE ID - item.courseDetails?.courseId:",
        item.courseDetails?.courseId,
      );
      console.log("FINAL EXTRACTED COURSE ID:", extractedCourseId);

      // Get classroomId from all possible places
      const classroomId = item.classroomId ?? item.hallId;

      // Get days from all possible places
      const daysOfWeek = item.daysOfWeek ?? item.days;

      const extraResponse = item as TTrainingSessionResponse & {
        enrolledCount?: number;
        registeredStudentsCount?: number;
        studentsCount?: number;
      };

      const mappedEnrollmentCount =
        item.studentEnrollmentCount ??
        item.enrolledStudentsCount ??
        extraResponse.enrolledCount ??
        extraResponse.registeredStudentsCount ??
        extraResponse.studentsCount;

      const mappedSession: TTrainingSessionDetails = {
        id: item.id,
        courseId: extractedCourseId,
        price: item.price,
        availableSeats: item.availableSeats,
        minSeats: item.minSeats,
        numberOfLectures: parsedLectures,
        requiredEquipment: item.requiredEquipment,
        duration: parsedDuration,
        status: item.status,
        courseName: item.courseName,
        courseDescription: item.courseDescription,
        classroomName: item.classroomName,
        teacherName: item.teacherName,
        instituteName: item.instituteName,
        image: item.image,
        enrolledStudentsCount: mappedEnrollmentCount,
        studentEnrollmentCount: mappedEnrollmentCount,
        startDate: item.startDate,
        startTime: item.startTime,
        endTime: item.endTime,
        daysOfWeek: daysOfWeek,
        classroomId: classroomId,
        teacherId: instructorId,
        isEnrolled: item.isEnrolled ?? item.isRegistered,
        isRegistered: item.isRegistered ?? item.isEnrolled,
        enrolledStudentIds: item.enrolledStudentIds,

        instructor: {
          ...(instructorId !== undefined ? { id: instructorId } : {}),
          name: item.instructor?.name || item.teacherName,
          title: item.instructor?.title || "مدرب",
          image: item.instructor?.image || "",
          email: item.instructor?.email || "",
          phone: item.instructor?.phone || "",
          certificates: item.instructor?.certificates || [],
          studentsCount: item.instructor?.studentsCount || 0,
          courseCount: item.instructor?.courseCount || 0,
          experienceYears: item.instructor?.experienceYears || 0,
          rating: item.instructor?.rating || 0,
          bio: item.instructor?.bio || "",
        },
        reviews: [],
      };

      return mappedSession;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actGetTrainingSessionDetails;
