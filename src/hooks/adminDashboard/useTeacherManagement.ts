import { useState, useCallback, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetTeachers from "../../store/teachers/act/actGetTeachers";
import actGetTeacherById from "../../store/teachers/act/actGetTeacherById";
import actDeleteTeacher from "../../store/teachers/act/actDeleteTeacher";
import actUpdateTeacher from "../../store/teachers/act/actUpdateTeacher";
import actUpdateTeacherProfileImage from "../../store/teachers/act/actUpdateTeacherProfileImage";
import actSearchTeachers from "../../store/teachers/act/actSearchTeachers";
import { selectTeachersState, resetTeachersError, resetSelectedTeacher } from "../../store/teachers/teachersSlice";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TeacherApiResponse, UpdateTeacherRequest } from "../../api/teacherApi";
import { AddTeacherFormData, EditTeacherFormData } from "../../validation/TeacherSchema";

export const useTeacherManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { teachers, searchResults, loading, searchLoading, error, selectedTeacher, selectedTeacherLoading, selectedTeacherError, updateLoading } = useAppSelector(selectTeachersState);

  const [searchTerm, setSearchTerm] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherApiResponse | null>(null);
  const [localEditTeacher, setLocalEditTeacher] = useState<TeacherApiResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch all teachers on mount only if we don't have data yet
  useEffect(() => {
    if (teachers.length === 0) {
      dispatch(actGetTeachers());
    }
  }, [dispatch, teachers.length]);

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

  const handleAddTeacher = useCallback((newTeacher: AddTeacherFormData & { cvFile: File | null }) => {
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

  const handleEditClick = useCallback((teacher: TeacherApiResponse) => {
    setLocalEditTeacher(teacher);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setLocalEditTeacher(null);
    setPendingImageFile(null);
  }, []);

  const handleImageUpdate = useCallback(async () => {
    if (!pendingImageFile || !localEditTeacher) return;

    const resultAction = await dispatch(
      actUpdateTeacherProfileImage({ id: localEditTeacher.id, file: pendingImageFile })
    );

    if (actUpdateTeacherProfileImage.rejected.match(resultAction)) {
      const errorMessage =
        typeof resultAction.payload === "string"
          ? resultAction.payload
          : "حدث خطأ أثناء تحديث صورة المعلم";
      showSnackbar(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }, [pendingImageFile, localEditTeacher, dispatch, showSnackbar]);

  const handleSaveEdit = useCallback(async (formData: EditTeacherFormData) => {
    if (!localEditTeacher) return;

    setIsUpdating(true);
    try {
      // Update image first if there's a pending file
      if (pendingImageFile) {
        await handleImageUpdate();
      }

      // Update teacher data
      const updatePayload: UpdateTeacherRequest = {
        userId: localEditTeacher.userId || 0,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        specialization: formData.specialization,
        certificates: formData.certificates,
        address: formData.address,
        cv: formData.cv,
        experienceYears: formData.experienceYears,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
        updatePayload.confirmPassword = formData.confirmPassword;
      }

      const resultAction = await dispatch(
        actUpdateTeacher({ id: localEditTeacher.id, data: updatePayload })
      );

      if (actUpdateTeacher.fulfilled.match(resultAction)) {
        showSnackbar("تم تحديث بيانات المعلم بنجاح", "success");
        setIsEditOpen(false);
        setPendingImageFile(null);
        dispatch(actGetTeachers());
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء تحديث البيانات";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("[DEBUG useTeacherManagement] handleSaveEdit error:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [localEditTeacher, pendingImageFile, handleImageUpdate, dispatch, showSnackbar]);

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

    console.log("Deleting teacher id:", teacherToDelete.id);

    try {
      const resultAction = await dispatch(
        actDeleteTeacher(teacherToDelete.id)
      );

      if (actDeleteTeacher.fulfilled.match(resultAction)) {
        setIsDeleteOpen(false);
        setTeacherToDelete(null);
        showSnackbar("تم حذف المعلم بنجاح", "success");
        dispatch(actGetTeachers());
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء حذف المعلم";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("[DEBUG useTeacherManagement] handleConfirmDelete error:", error);
      showSnackbar("حدث خطأ أثناء حذف المعلم", "error");
    }
  }, [dispatch, teacherToDelete, showSnackbar]);

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
    localEditTeacher,
    teacherToDelete,
    isAddOpen,
    isEditOpen,
    isDeleteOpen,
    isViewOpen,
    loading,
    searchLoading,
    selectedTeacherLoading,
    isUpdating,
    pendingImageFile,
    setPendingImageFile,
    handleAddTeacher,
    handleViewClick,
    handleCloseView,
    handleEditClick,
    handleCloseEdit,
    handleDeleteClick,
    handleCloseDelete,
    handleConfirmDelete,
    handleOpenAdd,
    handleCloseAdd,
    handleSaveEdit,
    handleImageUpdate,
    page,
    setPage,
    totalPages,
    rowsPerPage: ITEMS_PER_PAGE,
  };
};

