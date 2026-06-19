import { useState, useCallback, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetTeachers from "../../store/teachers/act/actGetTeachers";
import actGetTeacherById from "../../store/teachers/act/actGetTeacherById";
import { selectTeachersState, resetTeachersError, resetSelectedTeacher } from "../../store/teachers/teachersSlice";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TeacherApiResponse } from "../../api/teacherApi";

// We'll keep NewTeacherData for the add teacher form for now
import { NewTeacherData } from "../../types/teacher";

export const useTeacherManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { teachers, loading, error, selectedTeacher, selectedTeacherLoading, selectedTeacherError } = useAppSelector(selectTeachersState);

  const [searchTerm, setSearchTerm] = useState("");
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherApiResponse | null>(null);
  const [localEditTeacher, setLocalEditTeacher] = useState<TeacherApiResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch all teachers on mount
  useEffect(() => {
    dispatch(actGetTeachers());
  }, [dispatch]);

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

  // Filter and sort teachers (newest first, like students)
  const filteredTeachers = useMemo(() => {
    // Sort newest first (assuming id is numeric)
    const sortedTeachers = [...teachers].sort((a, b) => b.id - a.id);

    if (!searchTerm.trim()) return sortedTeachers;

    const term = searchTerm.toLowerCase();
    return sortedTeachers.filter((teacher) => {
      const fullName = `${teacher.firstName || ""} ${teacher.lastName || ""}`.toLowerCase();
      const email = (teacher.email || "").toLowerCase();
      const specialization = (teacher.specialization || "").toLowerCase();
      const username = (teacher.username || "").toLowerCase();
      const contactInfo = (teacher.contactInfo || "").toLowerCase();
      return (
        fullName.includes(term) ||
        email.includes(term) ||
        specialization.includes(term) ||
        username.includes(term) ||
        contactInfo.includes(term)
      );
    });
  }, [teachers, searchTerm]);

  const handleAddTeacher = useCallback((newTeacher: NewTeacherData) => {
    // For now, we'll just close modal since we don't have an add endpoint
    setIsAddOpen(false);
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
    // For now, use local teacher from list since we don't have edit endpoint yet
    setLocalEditTeacher(teacher);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setLocalEditTeacher(null);
  }, []);

  const handleDeleteClick = useCallback((teacher: TeacherApiResponse) => {
    setTeacherToDelete(teacher);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setTeacherToDelete(null);
  }, []);

  const handleSaveEdit = useCallback((updatedTeacher: TeacherApiResponse) => {
    // For now, just close modal since we don't have update endpoint
    setIsEditOpen(false);
    setLocalEditTeacher(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    // For now, just close modal since we don't have delete endpoint
    if (teacherToDelete) {
      setIsDeleteOpen(false);
      setTeacherToDelete(null);
    }
  }, [teacherToDelete]);

  const handleOpenAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  return {
    teachers,
    filteredTeachers,
    searchTerm,
    setSearchTerm,
    selectedTeacher,
    localEditTeacher,
    teacherToDelete,
    isAddOpen,
    isEditOpen,
    isDeleteOpen,
    isViewOpen,
    loading,
    selectedTeacherLoading,
    handleAddTeacher,
    handleViewClick,
    handleCloseView,
    handleEditClick,
    handleCloseEdit,
    handleDeleteClick,
    handleCloseDelete,
    handleSaveEdit,
    handleConfirmDelete,
    handleOpenAdd,
    handleCloseAdd,
  };
};

