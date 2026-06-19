import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  actGetTrainingSessionDetails,
  actAddCourseRating,
} from "../../store/Courses/trainingSessionsSlice";
import actEnrollInSession from "../../store/Courses/act/actEnrollInSession";
import actInitiatePayment from "../../store/Courses/act/actInitiatePayment";

// Helper function to get studentId safely
const getStudentId = (user: any) => {
  // Priority 1: user.studentId from Redux store
  if (user?.studentId) {
    console.log("getStudentId: Using user.studentId:", user.studentId);
    return user.studentId;
  }

  // Priority 2: localStorage.getItem("studentId")
  const localStorageStudentId = localStorage.getItem("studentId");
  if (localStorageStudentId) {
    const parsed = Number(localStorageStudentId);
    console.log("getStudentId: Using localStorage studentId:", parsed);
    return parsed;
  }

  console.log("getStudentId: No valid studentId found!");
  return null;
};

export const useTrainingSessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedTrainingSession: session,
    loading,
    error,
  } = useAppSelector((state) => state.trainingSessions);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(actGetTrainingSessionDetails(Number(id)));
    }
  }, [id, dispatch]);

  const handleAddRating = async (rating: number, review: string) => {
    const studentId = getStudentId(user);
    const resolvedCourseId = session?.courseId;

    console.log("FULL SESSION:", session);
    console.log("resolvedCourseId:", resolvedCourseId);
    console.log("studentId:", studentId);

    if (!resolvedCourseId) {
      console.error("Course ID not found in session data");
      return Promise.reject("تعذر العثور على معرف الدورة");
    }

    if (resolvedCourseId && studentId) {
      return dispatch(
        actAddCourseRating({
          courseId: resolvedCourseId,
          studentId: studentId,
          rating,
          review,
        }),
      ).unwrap();
    }
    return Promise.reject(
      "لم يتم العثور على معرف الطالب أو معرف الدورة/الجلسة، يرجى التأكد من تسجيل الدخول كطالب.",
    );
  };

  const handleEnroll = async () => {
    // IMPORTANT: Do NOT call /api/enrollments directly! Only use payment flow!
    return Promise.reject("يرجى استخدام زر الدفع للاشتراك في الدورة.");
  };

  const handleInitiatePayment = async () => {
    console.log("=== handleInitiatePayment Debug ===");
    console.log("Complete user object:", user);
    console.log("user.studentId:", user?.studentId);
    console.log("user.id:", user?.id);
    console.log("localStorage.studentId:", localStorage.getItem("studentId"));

    const studentId = getStudentId(user);
    const trainingSessionId = session?.id;

    console.log("Final studentId to send:", studentId);
    console.log("Type of studentId:", typeof studentId);
    console.log("trainingSessionId:", trainingSessionId);

    if (!studentId) {
      return Promise.reject(
        "لم يتم العثور على معرف الطالب. يرجى تسجيل الدخول مرة أخرى.",
      );
    }

    if (studentId && trainingSessionId) {
      console.log("Calling actInitiatePayment with:", {
        sessionId: Number(trainingSessionId),
        studentId: Number(studentId),
      });
      return dispatch(
        actInitiatePayment({
          sessionId: Number(trainingSessionId),
          studentId: Number(studentId),
        }),
      ).unwrap();
    }
    return Promise.reject(
      "بيانات الطالب أو الجلسة غير مكتملة، يرجى التأكد من تسجيل الدخول.",
    );
  };

  return {
    session,
    loading,
    error,
    reviews: session?.reviews ?? [],
    instructor: session?.instructor,
    handleAddRating,
    handleEnroll,
    handleInitiatePayment,
    handleInstituteClick: () => navigate(`/main/institute/1`),
    handleEnrollClick: () => console.log("تسجيل في:", session?.courseName),
  };
};

export default useTrainingSessionDetails;
