import { useState, useCallback, useEffect } from "react";
import { TCourse, TSession } from "../../types/cardType";
import { CourseFormData } from "../../validation/CourseSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetCoursesByTenantId from "../../store/Courses/act/actGetCoursesByTenantId";
import actCreateCourse from "../../store/Courses/act/actCreateCourse";
import actDeleteCourse from "../../store/Courses/act/actDeleteCourse";
import actUpdateCourse from "../../store/Courses/act/actUpdateCourse";
import actSearchCourses from "../../store/Courses/act/actSearchCourses";
import { selectCoursesState } from "../../store/Courses/courseSlice";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";
import { useSnackbar } from "../../Context/SnackbarContext";
import { UpdateCourseRequest } from "../../api/courseApi";

export const useCourseManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { courses: reduxCourses, loading: adminCoursesLoading, error: adminCoursesError, createLoading, createError, updateLoading, updateError, searchLoading, searchError } = useAppSelector(selectCoursesState);
  const { currentInstitute } = useAppSelector((state) => state.institutes);
  const { user } = useAppSelector((state) => state.auth);

  console.log("[useCourseManagement] currentInstitute:", currentInstitute);
  console.log("[useCourseManagement] currentInstitute?.tenantId:", currentInstitute?.tenantId);
  console.log("[useCourseManagement] user:", user);

  // First, fetch institute by userId (like AdminOverview)
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
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Sync local courses with Redux
  useEffect(() => {
    setCourses(reduxCourses);
  }, [reduxCourses]);

  // Fetch courses when currentInstitute has tenantId only if we don't have data yet
  useEffect(() => {
    if (currentInstitute?.tenantId && !isSearching && reduxCourses.length === 0) {
      dispatch(actGetCoursesByTenantId(currentInstitute.tenantId));
    }
  }, [dispatch, currentInstitute?.tenantId, isSearching, reduxCourses.length]);

  // Show errors
  useEffect(() => {
    if (adminCoursesError) {
      showSnackbar(adminCoursesError, "error");
    }
    if (createError) {
      showSnackbar(createError, "error");
    }
    if (updateError) {
      showSnackbar(updateError, "error");
    }
    if (searchError) {
      showSnackbar(searchError, "error");
    }
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
  }, []);

  const handleSaveEdit = useCallback(async (updateData: UpdateCourseRequest, onClose?: () => void) => {
    try {
      const resultAction = await dispatch(actUpdateCourse(updateData));
      if (actUpdateCourse.fulfilled.match(resultAction)) {
        showSnackbar("تم التعديل بنجاح", "success");
        setSelectedCourse(resultAction.payload);
        if (onClose) {
          onClose();
        }
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
    console.log("[useCourseManagement] handleSaveAdd called with data: ", data);
    console.log("[useCourseManagement] currentInstitute in handleSaveAdd: ", currentInstitute);
    if (!currentInstitute?.tenantId) {
      console.log("[useCourseManagement] currentInstitute or tenantId missing!");
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
    console.log("[useCourseManagement] POST payload: ", payload);

    try {
      const resultAction = await dispatch(actCreateCourse(payload));
      if (actCreateCourse.fulfilled.match(resultAction)) {
        showSnackbar("تم إضافة الكورس بنجاح", "success");
        setOpenAddModal(false);
        // Refresh courses list
        if (currentInstitute?.tenantId) {
          dispatch(actGetCoursesByTenantId(currentInstitute.tenantId));
        }
      }
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  }, [dispatch, currentInstitute, showSnackbar]);

  const handleAddSession = useCallback((sessionData: Omit<TSession, "id" | "lectures">) => {
    const newSession: TSession = {
      ...sessionData,
      id: Date.now(),
      lectures: [],
    };

    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === sessionData.courseId) {
          const updatedSessions = [...(course.sessions || []), newSession];
          const updatedCourse = { ...course, sessions: updatedSessions };
          if (selectedCourse?.id === sessionData.courseId) {
            setSelectedCourse(updatedCourse);
          }
          return updatedCourse;
        }
        return course;
      })
    );
  }, [selectedCourse]);

  return {
    courses,
    selectedCourse,
    isDeleteOpen,
    openEditModal,
    openAddModal,
    openDetailsModal,
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
  };
};
