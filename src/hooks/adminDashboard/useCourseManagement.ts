import { useState, useCallback, useEffect, useRef } from "react";
import { TCourse, TSession } from "../../types/cardType";
import { CourseFormData } from "../../validation/CourseSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetCoursesByTenantId from "../../store/Courses/act/actGetCoursesByTenantId";
import actCreateCourse from "../../store/Courses/act/actCreateCourse";
import actDeleteCourse from "../../store/Courses/act/actDeleteCourse";
import actUpdateCourse from "../../store/Courses/act/actUpdateCourse";
import actSearchCourses from "../../store/Courses/act/actSearchCourses";
import actGetActiveOrUpcomingByCourseAndInstitute from "../../store/Courses/act/actGetActiveOrUpcomingByCourseAndInstitute";
import actDeleteTrainingSession from "../../store/Courses/act/actDeleteTrainingSession";
import actCreateTrainingSession from "../../store/Courses/act/actCreateTrainingSession";
import actGetClassroomsByInstituteId from "../../store/Classrooms/act/actGetClassroomsByInstituteId";
import { selectCoursesState, addSessionToCourse, updateSessionInCourse, deleteSessionFromCourse, clearDeleteCourseState } from "../../store/Courses/courseSlice";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";
import { clearDeleteSessionState, clearDeleteLectureState } from "../../store/Courses/trainingSessionsSlice";
import { useSnackbar } from "../../Context/SnackbarContext";
import { UpdateCourseRequest } from "../../api/courseApi";
import { CreateTrainingSessionRequest } from "../../api/trainingSessionApi";

export const useCourseManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { courses: reduxCourses, loading: adminCoursesLoading, error: adminCoursesError, createLoading, createError, updateLoading, updateError, searchLoading, searchError, deletingCourseId, deleteError } = useAppSelector(selectCoursesState);
  const { deletingSessionId, sessionDeleteError } = useAppSelector((state) => state.trainingSessions);
  const { currentInstitute } = useAppSelector((state) => state.institutes);
  const { user } = useAppSelector((state) => state.auth);

  console.log("[useCourseManagement] currentInstitute:", currentInstitute);
  console.log("[useCourseManagement] currentInstitute?.tenantId:", currentInstitute?.tenantId);
  console.log("[useCourseManagement] user:", user);

  // Fetch institute by userId
  useEffect(() => {
    const userId = user?.id;
    console.log("[useCourseManagement] userId:", userId);
    if (userId && !currentInstitute) {
      console.log("[useCourseManagement] Dispatching actGetInstituteByUserId with userId:", userId);
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openEditModal, setOpenEditModel] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openConflictDialog, setOpenConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<any>(null);
  const [originalFormData, setOriginalFormData] = useState<CreateTrainingSessionRequest | null>(null);
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);

  const courses = reduxCourses;

  // Fetch courses when currentInstitute has tenantId
  useEffect(() => {
    if (currentInstitute?.tenantId && !isSearching && reduxCourses.length === 0) {
      dispatch(actGetCoursesByTenantId(currentInstitute.tenantId));
    }
  }, [dispatch, currentInstitute?.tenantId, isSearching, reduxCourses.length]);

  // Fetch sessions for all courses once
  const hasFetchedSessionsRef = useRef(false);
  useEffect(() => {
    if (currentInstitute?.id && courses.length > 0 && !hasFetchedSessionsRef.current) {
      courses.forEach(course => {
        dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId: course.id, instituteId: currentInstitute.id }));
      });
      hasFetchedSessionsRef.current = true;
    }
    if (!currentInstitute?.id) {
      hasFetchedSessionsRef.current = false;
    }
  }, [courses, currentInstitute, dispatch]);

  // Fetch classrooms when currentInstitute is available
  useEffect(() => {
    if (currentInstitute?.id) {
      dispatch(actGetClassroomsByInstituteId(currentInstitute.id));
    }
  }, [dispatch, currentInstitute?.id]);

  // Show errors
  useEffect(() => {
    if (adminCoursesError) showSnackbar(adminCoursesError, "error");
    if (createError) showSnackbar(createError, "error");
    if (updateError) showSnackbar(updateError, "error");
    if (searchError) showSnackbar(searchError, "error");
  }, [adminCoursesError, createError, updateError, searchError, showSnackbar]);

  // Handle search with debounce
  useEffect(() => {
    if (!currentInstitute?.tenantId) return;

    if (searchQuery.trim() === "") {
      setIsSearching(false);
      dispatch(actGetCoursesByTenantId(currentInstitute.tenantId));
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      dispatch(actSearchCourses({ 
        name: searchQuery, 
        tenantId: parseInt(currentInstitute.tenantId, 10) 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentInstitute?.tenantId, dispatch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleDeleteCourse = useCallback(async () => {
    if (!selectedCourse) return;
    try {
      const resultAction = await dispatch(actDeleteCourse(selectedCourse.id));
      if (actDeleteCourse.fulfilled.match(resultAction)) {
        showSnackbar("تم حذف الكورس بنجاح", "success");
        setIsDeleteOpen(false);
      }
      // Don't close the modal on rejection, so the user can see the error in DeleteModal
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  }, [dispatch, selectedCourse, showSnackbar]);

  const handleOpenDetail = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setOpenDetailsModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setOpenDetailsModal(false);
  }, []);

  const handleOpenEdit = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setOpenEditModel(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setOpenEditModel(false);
  }, []);

  const handleDeleteClick = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
    dispatch(clearDeleteCourseState());
  }, [dispatch]);

  const handleSaveEdit = useCallback(async (updateData: UpdateCourseRequest, onClose?: () => void) => {
    try {
      const resultAction = await dispatch(actUpdateCourse(updateData));
      if (actUpdateCourse.fulfilled.match(resultAction)) {
        showSnackbar("تم التعديل بنجاح", "success");
        setSelectedCourse(resultAction.payload);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  }, [dispatch, showSnackbar]);

  const handleOpenAdd = useCallback(() => {
    setOpenAddModal(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setOpenAddModal(false);
  }, []);

  const handleSaveAdd = useCallback(async (data: CourseFormData) => {
    if (!currentInstitute?.tenantId) {
      showSnackbar("لم يتم تحميل معلومات المعهد", "error");
      return;
    }

    const payload = {
      name: data.title,
      description: data.description,
      requirements: data.requirements,
      hours: parseInt(data.hoursCount, 10),
      categoryId: parseInt(data.categoryId, 10),
      tenantId: parseInt(currentInstitute.tenantId, 10)
    };

    try {
      const resultAction = await dispatch(actCreateCourse(payload));
      if (actCreateCourse.fulfilled.match(resultAction)) {
        showSnackbar("تم إضافة الكورس بنجاح", "success");
        setOpenAddModal(false);
        dispatch(actGetCoursesByTenantId(currentInstitute.tenantId));
      }
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  }, [dispatch, currentInstitute, showSnackbar]);

  const handleCloseConflictDialog = useCallback(() => {
    setOpenConflictDialog(false);
    setConflictData(null);
    setOriginalFormData(null);
  }, []);

  const formatTimeForApi = (timeStr: any) => {
    if (!timeStr) return "00:00:00";
    if (typeof timeStr === "string") {
      const parts = timeStr.split(":");
      const hour = parts[0]?.padStart(2, "0") || "00";
      const minute = parts[1]?.padStart(2, "0") || "00";
      return `${hour}:${minute}:00`;
    }
    if (typeof timeStr === "object" && timeStr !== null && "hour" in timeStr && "minute" in timeStr) {
      const hour = String(timeStr.hour).padStart(2, "0");
      const minute = String(timeStr.minute).padStart(2, "0");
      return `${hour}:${minute}:00`;
    }
    return "00:00:00";
  };

  // دالة اختيار اقتراح الباك إند المحدّثة لمعالجة تكرار الـ 409 وحساب الوقت بدقة
  const handleSelectSuggestion = useCallback(async (suggestion: any, onSuccess?: () => void) => {
    console.log("=== handleSelectSuggestion CALLED ===");
    console.log("originalFormData:", originalFormData);
    console.log("Selected Suggestion:", suggestion);
    
    if (!originalFormData) return;

    let updatedData = { ...originalFormData };

    // 1. استخراج معرف القاعة بشكل صحيح
    const newClassroomId = suggestion.classroomId ?? suggestion.roomId ?? suggestion.hallId ?? suggestion.id;
    if (newClassroomId !== undefined && newClassroomId !== null) {
      updatedData.classroomId = Number(newClassroomId);
    }

    // 2. تحديث التوقيت الزمني
    if (suggestion.startTime) updatedData.startTime = formatTimeForApi(suggestion.startTime);
    
    if (suggestion.endTime) {
      updatedData.endTime = formatTimeForApi(suggestion.endTime);
    } else if (suggestion.startTime && originalFormData.startTime && originalFormData.endTime) {
      // حساب المدة الزمنية من الطلب الأصلي لتفادي مشاكل الـ Duration
      const [origStartH, origStartM] = originalFormData.startTime.split(':').map(Number);
      const [origEndH, origEndM] = originalFormData.endTime.split(':').map(Number);
      const durationInMinutes = (origEndH * 60 + origEndM) - (origStartH * 60 + origStartM);

      const [newStartH, newStartM] = updatedData.startTime.split(':').map(Number);
      const totalEndMinutes = (newStartH * 60 + newStartM) + durationInMinutes;
      
      const newEndH = Math.floor(totalEndMinutes / 60) % 24;
      const newEndM = totalEndMinutes % 60;
      updatedData.endTime = `${String(newEndH).padStart(2, '0')}:${String(newEndM).padStart(2, '0')}:00`;
    }

    // 3. تحديث تاريخ البدء المقترح
    if (suggestion.date) updatedData.startDate = suggestion.date;
    else if (suggestion.startDate) updatedData.startDate = suggestion.startDate;

    // 4. بناء الـ Payload النهائي النظيف
    const cleanPayload: CreateTrainingSessionRequest = {
      courseId: Number(updatedData.courseId),
      teacherId: Number(updatedData.teacherId),
      classroomId: Number(updatedData.classroomId),
      price: Number(updatedData.price),
      availableSeats: Number(updatedData.availableSeats),
      minSeats: Number(updatedData.minSeats),
      numberOfLectures: Number(updatedData.numberOfLectures),
      duration: updatedData.duration,
      status: updatedData.status,
      requiredEquipment: updatedData.requiredEquipment,
      startDate: updatedData.startDate,
      startTime: updatedData.startTime,
      endTime: updatedData.endTime,
      daysOfWeek: updatedData.daysOfWeek,
    };

    console.log("=== cleanPayload to submit ===", cleanPayload);
    setSubmittingSuggestion(true);
    
    try {
      const resultAction = await dispatch(actCreateTrainingSession(cleanPayload));
      if (actCreateTrainingSession.fulfilled.match(resultAction)) {
        showSnackbar("تم إنشاء الدورة بنجاح باستخدام اقتراح النظام", "success");
        if (currentInstitute?.id) {
          dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId: cleanPayload.courseId, instituteId: currentInstitute.id }));
        }
        setOpenConflictDialog(false);
        setConflictData(null);
        setOriginalFormData(null);
        if (onSuccess) onSuccess();
      } else {
        const payload = resultAction.payload as any;
        
        // إذا واجه الاقتراح الحالي تضارباً إضافياً، يتم تحديث الديالوج بالاقتراحات الجديدة فوراً
        if (payload?.status === 409 || resultAction.meta.requestStatus === "rejected") {
          const errorData = payload?.data || payload;
          console.log("New Conflict from suggestion. Updating dialogue:", errorData);
          setConflictData(errorData);
          showSnackbar("الاقتراح المختار واجه تعارضاً زملانياً آخر، تم تحديث كروت الخيارات.", "warning");
        } else {
          showSnackbar(payload || "حدث خطأ أثناء إنشاء الدورة", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      showSnackbar("حدث خطأ أثناء إنشاء الدورة", "error");
    } finally {
      setSubmittingSuggestion(false);
    }
  }, [originalFormData, dispatch, currentInstitute, showSnackbar]);

  const handleAddSession = useCallback(async (sessionData: CreateTrainingSessionRequest, onSuccess?: () => void) => {
    setCreatingSession(true);
    try {
      const resultAction = await dispatch(actCreateTrainingSession(sessionData));
      if (actCreateTrainingSession.fulfilled.match(resultAction)) {
        showSnackbar("تم إنشاء الدورة بنجاح", "success");
        if (currentInstitute?.id) {
          dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId: sessionData.courseId, instituteId: currentInstitute.id }));
        }
        if (onSuccess) onSuccess();
      } else {
        const payload = resultAction.payload as any;
        if (payload?.status === 409) {
          setOriginalFormData(sessionData);
          setConflictData(payload.data);
          setOpenConflictDialog(true);
        } else {
          showSnackbar(payload || "حدث خطأ أثناء إنشاء الدورة", "error");
        }
      }
    } catch (error) {
      console.error("Error creating training session:", error);
      showSnackbar("حدث خطأ أثناء إنشاء الدورة", "error");
    } finally {
      setCreatingSession(false);
    }
  }, [dispatch, currentInstitute, showSnackbar]);

  const handleUpdateSession = useCallback((updatedSession: TSession) => {
    dispatch(updateSessionInCourse({ courseId: updatedSession.courseId, session: updatedSession }));
    if (selectedCourse?.id === updatedSession.courseId) {
      setSelectedCourse(prev => prev ? {
        ...prev,
        sessions: prev.sessions?.map(s => s.id === updatedSession.id ? updatedSession : s)
      } : null);
    }
  }, [dispatch, selectedCourse]);

  const handleDeleteSession = useCallback(async (courseId: number, sessionId: number) => {
    try {
      const resultAction = await dispatch(actDeleteTrainingSession(sessionId));
      if (actDeleteTrainingSession.fulfilled.match(resultAction)) {
        dispatch(deleteSessionFromCourse({ courseId, sessionId }));
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(prev => prev ? {
            ...prev,
            sessions: prev.sessions?.filter(s => s.id !== sessionId)
          } : null);
        }
        showSnackbar("تم حذف الدورة بنجاح", "success");
        return true;
      }
      // Don't show snackbar on rejection - error will appear in DeleteModal
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }, [dispatch, selectedCourse, showSnackbar]);

  const handleFetchSessions = useCallback((courseId: number) => {
    if (currentInstitute?.id) {
      dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId, instituteId: currentInstitute.id }));
    }
  }, [dispatch, currentInstitute]);

  const handleClearDeleteSessionState = useCallback(() => {
    dispatch(clearDeleteSessionState());
  }, [dispatch]);

  const handleClearDeleteLectureState = useCallback(() => {
    dispatch(clearDeleteLectureState());
  }, [dispatch]);

  return {
    courses,
    selectedCourse,
    isDeleteOpen,
    openEditModal,
    openAddModal,
    openDetailsModal,
    openConflictDialog,
    conflictData,
    createLoading,
    updateLoading,
    searchLoading,
    adminCoursesLoading,
    tenantId: currentInstitute?.tenantId ? parseInt(currentInstitute.tenantId, 10) : 0,
    searchQuery,
    handleSearch,
    handleClearSearch,
    handleDeleteCourse,
    handleOpenDetail,
    handleCloseDetail,
    handleOpenEdit,
    handleCloseEdit,
    handleDeleteClick,
    handleCloseDelete,
    handleSaveEdit,
    handleOpenAdd,
    handleCloseAdd,
    handleSaveAdd,
    handleAddSession,
    handleUpdateSession,
    handleDeleteSession,
    handleFetchSessions,
    handleCloseConflictDialog,
    handleSelectSuggestion,
    submittingSuggestion,
    creatingSession,
    deletingCourseId,
    deletingSessionId,
    deleteError,
    sessionDeleteError,
    handleClearDeleteSessionState,
    handleClearDeleteLectureState,
  };
};