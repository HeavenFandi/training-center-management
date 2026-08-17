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
    return user.studentId;
  }

  // Priority 2: localStorage.getItem("studentId")
  const localStorageStudentId = localStorage.getItem("studentId");
  if (localStorageStudentId) {
    const parsed = Number(localStorageStudentId);
    return parsed;
  }

  return null;
};

export const useTrainingSessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedTrainingSession: session,
    sessionDetailsLoading: loading,
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
    const studentId = getStudentId(user);
    const trainingSessionId = session?.id;

    if (!studentId) {
      return Promise.reject(
        "لم يتم العثور على معرف الطالب. يرجى تسجيل الدخول مرة أخرى.",
      );
    }

    if (studentId && trainingSessionId) {
      const paymentUrl = await dispatch(
        actInitiatePayment({
          sessionId: Number(trainingSessionId),
          studentId: Number(studentId),
        }),
      ).unwrap();

      // IMMEDIATELY RE-FETCH FRESH DATA FROM THE SERVER AFTER SUCCESSFUL REGISTRATION INITIATION
      await dispatch(
        actGetTrainingSessionDetails(Number(trainingSessionId)),
      ).unwrap();

      return paymentUrl;
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
    handleEnrollClick: () => {},
  };
};

export default useTrainingSessionDetails;
