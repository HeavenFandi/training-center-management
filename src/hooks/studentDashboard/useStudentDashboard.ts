import { useState, useCallback, useEffect } from "react";
import { Student } from "../../types/studentDashboard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  actFetchProfile,
  actUpdateProfile,
  actUpdateProfileImage,
  actFetchTrainingHours,
  actFetchCompletionPercentage,
  actFetchWeeklySchedule,
  actFetchActiveStudentCourses,
  resetProfileState,
} from "../../store/StudentProfile/studentProfileSlice";
import axiosClient from "../../api/axiosClient";

const getStudentId = (user: any): number | null => {
  if (user?.studentId && !isNaN(Number(user.studentId))) {
    return Number(user.studentId);
  }

  const lsStudentId = localStorage.getItem("studentId");
  if (lsStudentId) {
    const parsed = Number(lsStudentId);
    if (!isNaN(parsed) && parsed > 0) {
      console.log("[DEBUG getStudentId] ✅ Using valid studentId from localStorage:", parsed);
      return parsed;
    } else {
      console.error("[DEBUG getStudentId] ❌ localStorage studentId is invalid:", lsStudentId);
    }
  }

  console.log("[DEBUG getStudentId] ❌ No studentId found. Checking for userId...");
  const lsUserId = localStorage.getItem("userId");
  console.log("[DEBUG getStudentId] localStorage.getItem('userId'):", lsUserId);

  console.error("[DEBUG getStudentId] === END: NO STUDENT ID FOUND ===");
  return null;
};

export const useStudentDashboard = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const { user } = useAppSelector((state) => state.auth);
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
    weeklySchedule,
    scheduleLoading,
    scheduleError,
    activeCourses,
    activeCoursesLoading,
    activeCoursesError,
  } = useAppSelector((state) => state.studentProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("[DEBUG useStudentDashboard] === FULL localStorage CONTENTS ===");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`  [${i}] ${key} =`, localStorage.getItem(key));
      }
    }
    console.log("[DEBUG useStudentDashboard] === END localStorage CONTENTS ===");
  }, []);

  useEffect(() => {
    console.log("[DEBUG useStudentDashboard] auth.user updated:", user);
  }, [user]);

  useEffect(() => {
    console.log("[DEBUG useStudentDashboard] studentProfile state updated:", {
      profile,
      loading,
      error,
      updateLoading,
      updateError,
      success,
    });
  }, [profile, loading, error, updateLoading, updateError, success]);

  useEffect(() => {
    console.log("[DEBUG useStudentDashboard] === useEffect to fetch profile TRIGGERED ===");

    const studentId = getStudentId(user);
    console.log("[DEBUG useStudentDashboard] studentId determined:", studentId);

    if (studentId) {
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actFetchProfile with studentId:", studentId);
      dispatch(actFetchProfile(studentId));
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actFetchTrainingHours with studentId:", studentId);
      dispatch(actFetchTrainingHours(studentId));
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actFetchCompletionPercentage with studentId:", studentId);
      dispatch(actFetchCompletionPercentage(studentId));
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actFetchWeeklySchedule with studentId:", studentId);
      dispatch(actFetchWeeklySchedule(studentId));
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actFetchActiveStudentCourses with studentId:", studentId);
      dispatch(actFetchActiveStudentCourses(studentId));
    } else {
      console.error("[DEBUG useStudentDashboard] ❌ No studentId found - NOT dispatching fetch!");
      const userId = localStorage.getItem("userId");
      if (userId && !isNaN(Number(userId))) {
        console.log("[DEBUG useStudentDashboard] Attempting manual studentId fetch using userId:", userId);
        (async () => {
          try {
            const studentsRes = await axiosClient.get("/students");
            let students = [];
            if (Array.isArray(studentsRes.data)) {
              students = studentsRes.data;
            } else if (studentsRes.data && "data" in studentsRes.data && Array.isArray(studentsRes.data.data)) {
              students = studentsRes.data.data;
            }
            console.log("[DEBUG useStudentDashboard] Manual students fetch result:", students);
            const matched = students.find((s: any) => s.userId === Number(userId));
            if (matched) {
              console.log("[DEBUG useStudentDashboard] ✅ Manual fetch found studentId:", matched.id);
              localStorage.setItem("studentId", String(matched.id));
              dispatch(actFetchProfile(matched.id));
              dispatch(actFetchTrainingHours(matched.id));
              dispatch(actFetchCompletionPercentage(matched.id));
              dispatch(actFetchWeeklySchedule(matched.id));
              dispatch(actFetchActiveStudentCourses(matched.id));
            }
          } catch (e) {
            console.error("[DEBUG useStudentDashboard] Manual studentId fetch failed:", e);
          }
        })();
      }
    }
  }, [user, dispatch]);

  const handleSave = useCallback(
    async (updatedStudent: Student) => {
      console.log("[DEBUG useStudentDashboard] === handleSave CALLED ===");
      const studentId = getStudentId(user);
      console.log("[DEBUG useStudentDashboard] studentId:", studentId);
      console.log("[DEBUG useStudentDashboard] updatedStudent payload:", updatedStudent);

      if (!studentId) {
        console.error("[DEBUG useStudentDashboard] ❌ Cannot update: studentId is null!");
        return;
      }

      try {
        console.log("[DEBUG useStudentDashboard] ✅ Dispatching actUpdateProfile...");
        await dispatch(actUpdateProfile({ studentId, profileData: updatedStudent })).unwrap();
        console.log("[DEBUG useStudentDashboard] ✅ actUpdateProfile dispatch completed successfully!");
      } catch (err) {
        console.error("[DEBUG useStudentDashboard] ❌ Error in handleSave:", err);
      }
    },
    [user, dispatch]
  );

  const handleImageUpdate = useCallback(async () => {
    if (!pendingImageFile) return;

    const studentId = getStudentId(user);
    if (!studentId) {
      console.error("[DEBUG useStudentDashboard] ❌ Cannot update image: studentId is null!");
      return;
    }

    try {
      console.log("[DEBUG useStudentDashboard] ✅ Dispatching actUpdateProfileImage...");
      await dispatch(actUpdateProfileImage({ studentId, imageFile: pendingImageFile })).unwrap();
      setPendingImageFile(null);
      console.log("[DEBUG useStudentDashboard] ✅ actUpdateProfileImage dispatch completed successfully!");
    } catch (err) {
      console.error("[DEBUG useStudentDashboard] ❌ Error in handleImageUpdate:", err);
    }
  }, [pendingImageFile, user, dispatch]);

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
    bio: "",
    enrollmentDate: "",
    image: "",
  };

  console.log("[DEBUG useStudentDashboard] Returning student object to UI:", student);
  console.log("[DEBUG useStudentDashboard] Returning student.bio:", student.bio);

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
    activeCourses,
    activeCoursesLoading,
    activeCoursesError,
    openEdit,
    handleSave,
    handleImageUpdate,
    setPendingImageFile,
    handleOpenEdit,
    handleCloseEdit,
  };
};
