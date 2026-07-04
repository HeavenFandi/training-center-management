import { useState, useCallback, useMemo, useEffect } from "react";
import { CreateStudentResponse, getStudentActiveCourses } from "../../api/studentApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetStudents from "../../store/Students/act/actGetStudents";
import actDeleteStudent from "../../store/Students/act/actDeleteStudent";
import actSearchStudents from "../../store/Students/act/actSearchStudents";
import { selectStudentsState, resetStudentsError } from "../../store/Students/studentsSlice";
import { actGetInstituteByUserId, actGetStudentsCount, actGetInstituteUsersCount } from "../../store/Institutes/institutesSlice";
import { useSnackbar } from "../../Context/SnackbarContext";

export const useStudentManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { students, searchResults, loading, searchLoading, error } = useAppSelector(selectStudentsState);
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute, studentsCount, studentsCountLoading, studentsCountError } = useAppSelector((state) => state.institutes);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<CreateStudentResponse | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<CreateStudentResponse | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  // Track which students have active courses (cannot be deleted)
  const [studentsWithActiveCourses, setStudentsWithActiveCourses] = useState<Set<number>>(new Set());

  // First, fetch institute by userId
  useEffect(() => {
    const userId = user?.id;
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  // Fetch students on load only if we don't have data yet
  useEffect(() => {
    if (currentInstitute?.tenantId && students.length === 0) {
      dispatch(actGetStudents(currentInstitute.tenantId));
    }
  }, [dispatch, students.length, currentInstitute?.tenantId]);

  // Fetch students count from backend
  useEffect(() => {
    const tenantId = currentInstitute?.tenantId;
    if (tenantId) {
      dispatch(actGetStudentsCount(tenantId));
    }
  }, [dispatch, currentInstitute?.tenantId]);

  // Debounce search term and dispatch search
  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        dispatch(actSearchStudents(searchTerm.trim()));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [dispatch, searchTerm]);

  // Check active courses for each student when students list changes
  useEffect(() => {
    const checkAllStudentsEnrollments = async () => {
      const enrolledStudentIds = new Set<number>();
      for (const student of students) {
        try {
          const activeCourses = await getStudentActiveCourses(student.id);
          if (activeCourses.length > 0) {
            enrolledStudentIds.add(student.id);
          }
        } catch (err) {
          console.error(`Error checking enrollments for student ${student.id}:`, err);
        }
      }
      setStudentsWithActiveCourses(enrolledStudentIds);
    };
    
    if (students.length > 0) {
      checkAllStudentsEnrollments();
    }
  }, [students]);

  // Show error snackbar if there's an error
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
      dispatch(resetStudentsError());
    }
  }, [error, showSnackbar, dispatch]);

  // Reset page to 1 when search term changes
  const handleSearchTermChange = useCallback((newTerm: string) => {
    setSearchTerm(newTerm);
    setPage(1);
  }, []);

  // Get filtered students (use searchResults if searchTerm exists, else all students sorted newest first)
  const filteredStudents = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults;
    }
    // Sort students descending by enrollmentDate when no search
    return [...students].sort((a, b) => {
      const dateA = a.enrollmentDate ? new Date(a.enrollmentDate).getTime() : 0;
      const dateB = b.enrollmentDate ? new Date(b.enrollmentDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [searchTerm, students, searchResults]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  }, [filteredStudents.length, ITEMS_PER_PAGE]);

  // Get paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, page, ITEMS_PER_PAGE]);

  const handleAddStudent = useCallback(
    (data: CreateStudentResponse) => {
      setIsAddOpen(false);
      // Refetch all counts and list on success
      const tenantId = currentInstitute?.tenantId;
      const instituteId = currentInstitute?.id;
      if (tenantId) {
        dispatch(actGetStudents(tenantId));
        dispatch(actGetStudentsCount(tenantId));
      }
      if (instituteId) {
        dispatch(actGetInstituteUsersCount(instituteId));
      }
    },
    [dispatch, currentInstitute],
  );

  const handleViewClick = useCallback((student: CreateStudentResponse) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewOpen(false);
  }, []);

  const handleDeleteClick = useCallback((student: CreateStudentResponse) => {
    setStudentToDelete(student);
    // Check if student has active courses
    if (studentsWithActiveCourses.has(student.id)) {
      setDeleteErrorMessage("Student cannot be deleted until course completion.");
    } else {
      setDeleteErrorMessage(null);
    }
    setIsDeleteOpen(true);
  }, [studentsWithActiveCourses]);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setDeleteErrorMessage(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!studentToDelete || !studentToDelete.id) return;
    
    // Check if student has active courses before trying to delete
    if (studentsWithActiveCourses.has(studentToDelete.id)) {
      showSnackbar("Student cannot be deleted until course completion.", "error");
      setIsDeleteOpen(false);
      setDeleteErrorMessage(null);
      return;
    }

    console.log("Deleting student id:", studentToDelete.id);

    try {
      const resultAction = await dispatch(
        actDeleteStudent(studentToDelete.id)
      );

      if (actDeleteStudent.fulfilled.match(resultAction)) {
        setIsDeleteOpen(false);
        setStudentToDelete(null);
        setDeleteErrorMessage(null);
        showSnackbar("تم حذف الطالب بنجاح", "success");
        const tenantId = currentInstitute?.tenantId;
        const instituteId = currentInstitute?.id;
        if (tenantId) {
          dispatch(actGetStudents(tenantId));
          dispatch(actGetStudentsCount(tenantId));
        }
        if (instituteId) {
          dispatch(actGetInstituteUsersCount(instituteId));
        }
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء حذف الطالب";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("[DEBUG useStudentManagement] handleConfirmDelete error:", error);
      showSnackbar("حدث خطأ أثناء حذف الطالب", "error");
    }
  }, [dispatch, studentToDelete, showSnackbar, studentsWithActiveCourses, currentInstitute]);

  const handleOpenAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  return {
    students,
    filteredStudents,
    paginatedStudents,
    searchTerm,
    setSearchTerm: handleSearchTermChange,
    selectedStudent,
    studentToDelete,
    isAddOpen,
    isDeleteOpen,
    isViewOpen,
    loading,
    searchLoading,
    error,
    handleAddStudent,
    handleViewClick,
    handleCloseView,
    handleDeleteClick,
    handleCloseDelete,
    handleConfirmDelete,
    handleOpenAdd,
    handleCloseAdd,
    studentsWithActiveCourses,
    deleteErrorMessage,
    page,
    setPage,
    totalPages,
    rowsPerPage: ITEMS_PER_PAGE,
    studentsCount,
    studentsCountLoading,
    studentsCountError,
  };
};
