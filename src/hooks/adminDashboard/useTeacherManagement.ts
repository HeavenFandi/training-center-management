import { useState, useCallback, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetTeachers from "../../store/teachers/act/actGetTeachers";
import actGetTeachersByInstituteId from "../../store/teachers/act/actGetTeachersByInstituteId";
import actGetTeacherById from "../../store/teachers/act/actGetTeacherById";
import actDeleteTeacher from "../../store/teachers/act/actDeleteTeacher";
import actSearchTeachers from "../../store/teachers/act/actSearchTeachers";
import { selectTeachersState, resetTeachersError, resetSelectedTeacher } from "../../store/teachers/teachersSlice";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TeacherApiResponse } from "../../api/teacherApi";
import { AddTeacherFormData } from "../../validation/TeacherSchema";

export const useTeacherManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { teachers, searchResults, loading, searchLoading, error, selectedTeacher, selectedTeacherLoading, selectedTeacherError } = useAppSelector(selectTeachersState);
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute } = useAppSelector((state) => state.institutes);

  const [searchTerm, setSearchTerm] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherApiResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // First, fetch institute by userId
  useEffect(() => {
    const userId = user?.id;
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  // Fetch teachers when currentInstitute is available
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    if (instituteId) {
      dispatch(actGetTeachersByInstituteId(instituteId));
    }
  }, [dispatch, currentInstitute?.id]);

  // Debounce search term and dispatch search
  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        dispatch(actSearchTeachers(searchTerm.trim()));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dispatch, searchTerm]);

  // Show error snackbar if error
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
      dispatch(resetTeachersError());
    }
  }, [error, showSnackbar, dispatch]);

  // Show error snackbar if selected teacher error
  useEffect(() => {
    if (selectedTeacherError) {
      showSnackbar(selectedTeacherError, "error");
    }
  }, [selectedTeacherError, showSnackbar]);

  // Reset page to 1 when search term changes
  const handleSearchTermChange = useCallback((newTerm: string) => {
    setSearchTerm(newTerm);
    setPage(1);
  }, []);

  // Get filtered teachers (use searchResults if searchTerm exists, else all teachers sorted newest first)
  const filteredTeachers = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults;
    }
    // Sort newest first (assuming id is numeric) when no search
    return [...teachers].sort((a, b) => b.id - a.id);
  }, [searchTerm, teachers, searchResults]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  }, [filteredTeachers.length, ITEMS_PER_PAGE]);

  // Get paginated teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, page, ITEMS_PER_PAGE]);

  const handleAddTeacher = useCallback((newTeacher: AddTeacherFormData) => {
    // Modal is closed by useAddTeacherForm now
  }, []);

  const handleViewClick = useCallback((teacher: TeacherApiResponse) => {
    dispatch(actGetTeacherById(teacher.id));
    setIsViewOpen(true);
  }, [dispatch]);

  const handleCloseView = useCallback(() => {
    setIsViewOpen(false);
    dispatch(resetSelectedTeacher());
  }, [dispatch]);

  const handleDeleteClick = useCallback((teacher: TeacherApiResponse) => {
    setTeacherToDelete(teacher);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setTeacherToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!teacherToDelete || !teacherToDelete.id) return;

    try {
      const resultAction = await dispatch(
        actDeleteTeacher(teacherToDelete.id)
      );

      if (actDeleteTeacher.fulfilled.match(resultAction)) {
        setIsDeleteOpen(false);
        setTeacherToDelete(null);
        showSnackbar("تم حذف المعلم بنجاح", "success");
        const instituteId = currentInstitute?.id;
        if (instituteId) {
          dispatch(actGetTeachersByInstituteId(instituteId));
        }
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء حذف المعلم";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[DEBUG useTeacherManagement] handleConfirmDelete error:", error);
      }
      showSnackbar("حدث خطأ أثناء حذف المعلم", "error");
    }
  }, [dispatch, teacherToDelete, showSnackbar, currentInstitute]);

  const handleOpenAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  return {
    teachers,
    filteredTeachers,
    paginatedTeachers,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    selectedTeacher,
    teacherToDelete,
    isAddOpen,
    isDeleteOpen,
    isViewOpen,
    loading,
    searchLoading,
    selectedTeacherLoading,
    handleAddTeacher,
    handleViewClick,
    handleCloseView,
    handleDeleteClick,
    handleCloseDelete,
    handleConfirmDelete,
    handleOpenAdd,
    handleCloseAdd,
    page,
    setPage,
    totalPages,
    rowsPerPage: ITEMS_PER_PAGE,
  };
};
