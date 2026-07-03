import { useState, useCallback, useEffect, useMemo } from "react";
import { Student } from "../../types/studentDashboard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  actFetchProfile,
  actUpdateProfile,
  actUpdateProfileImage,
  actFetchTrainingHours,
  actFetchCompletionPercentage,
  actFetchWeeklySchedule,
  resetProfileState,
} from "../../store/StudentProfile/studentProfileSlice";

export const useStudentDashboard = (options?: { referenceDate?: Date }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const referenceDate = options?.referenceDate;

  const { user, userType } = useAppSelector((state) => state.auth);
  const {
    profile,
    loading,
    error,
    updateLoading,
    updateError,
    success,
    imageUpdateLoading,
    imageUpdateError,
    trainingHours,
    trainingHoursLoading,
    trainingHoursError,
    completionPercentage,
    completionPercentageLoading,
    completionPercentageError,
    completionPercentageItems,
    weeklySchedule,
    scheduleLoading,
    scheduleError,
    activeCoursesError,
  } = useAppSelector((state) => state.studentProfile);
  const dispatch = useAppDispatch();

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch data when user changes or on initial load
  useEffect(() => {
    // Only fetch if we have a student user with valid studentId
    if (userType === "STUDENT" && user?.studentId && !isNaN(Number(user.studentId))) {
      const studentId = Number(user.studentId);
      
      dispatch(actFetchProfile(studentId));
      dispatch(actFetchTrainingHours(studentId));
      dispatch(actFetchCompletionPercentage(studentId));

      const referenceDateStr = referenceDate
        ? formatDate(referenceDate)
        : undefined;
      dispatch(
        actFetchWeeklySchedule({ studentId, referenceDate: referenceDateStr }),
      );
    }
  }, [user, userType, dispatch, referenceDate]);

  // Refetch weekly schedule when referenceDate changes
  useEffect(() => {
    if (userType === "STUDENT" && user?.studentId && !isNaN(Number(user.studentId)) && referenceDate) {
      const studentId = Number(user.studentId);
      dispatch(
        actFetchWeeklySchedule({ studentId, referenceDate: formatDate(referenceDate) }),
      );
    }
  }, [referenceDate, user, userType, dispatch]);

  const activeCoursesWithCompletion = useMemo(() => {
    return completionPercentageItems.map((item) => {
      const attendancePercentage =
        typeof item.attendancePercentage === "number"
          ? item.attendancePercentage
          : item.totalLectures > 0
          ? item.lecturesAttended / item.totalLectures
          : 0;

      return {
        studentId: item.studentId ?? 0,
        trainingSessionId: item.trainingSessionId ?? 0,
        courseName: item.courseName ?? "",
        totalLectures: item.totalLectures ?? 0,
        lecturesAttended: item.lecturesAttended ?? 0,
        image: item.image ?? "",
        startDate: item.startDate ?? null,
        attendancePercentage,
      };
    });
  }, [completionPercentageItems]);

  const handleSave = useCallback(
    async (updatedStudent: Student) => {
      if (userType !== "STUDENT" || !user?.studentId || isNaN(Number(user.studentId))) {
        return;
      }

      const studentId = Number(user.studentId);

      try {
        await dispatch(
          actUpdateProfile({ studentId, profileData: updatedStudent }),
        ).unwrap();
      } catch (err) {
        console.error(err);
      }
    },
    [user, userType, dispatch],
  );

  const handleImageUpdate = useCallback(async () => {
    if (!pendingImageFile) return;
    if (userType !== "STUDENT" || !user?.studentId || isNaN(Number(user.studentId))) {
      return;
    }

    const studentId = Number(user.studentId);

    try {
      await dispatch(
        actUpdateProfileImage({ studentId, imageFile: pendingImageFile }),
      ).unwrap();
      setPendingImageFile(null);
    } catch (err) {
      console.error(err);
    }
  }, [pendingImageFile, user, userType, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setOpenEdit(false);
        dispatch(resetProfileState());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleOpenEdit = useCallback(() => {
    dispatch(resetProfileState());
    setPendingImageFile(null);
    setOpenEdit(true);
  }, [dispatch]);

  const handleCloseEdit = useCallback(() => {
    setOpenEdit(false);
    setPendingImageFile(null);
    dispatch(resetProfileState());
  }, [dispatch]);

  const student = profile || {
    id: 0,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    contactInfo: "",
    gender: "",
    birthDate: "",
    address: "",
    interest: "",
    bio: "",
    enrollmentDate: "",
    image: "",
  };

  return {
    student,
    loading,
    error,
    updateLoading,
    updateError,
    success,
    imageUpdateLoading,
    imageUpdateError,
    trainingHours,
    trainingHoursLoading,
    trainingHoursError,
    completionPercentage,
    completionPercentageLoading,
    completionPercentageError,
    weeklySchedule,
    scheduleLoading,
    scheduleError,
    activeCourses: activeCoursesWithCompletion,
    activeCoursesLoading: completionPercentageLoading,
    activeCoursesError: completionPercentageError || activeCoursesError,
    openEdit,
    handleSave,
    handleImageUpdate,
    setPendingImageFile,
    handleOpenEdit,
    handleCloseEdit,
  };
};
