import { useState, useCallback, useMemo, useEffect } from "react";
import { CreateStudentResponse, UpdateStudentRequest, getStudentActiveCourses } from "../../api/studentApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetStudents from "../../store/Students/act/actGetStudents";
import actUpdateStudent from "../../store/Students/act/actUpdateStudent";
import actDeleteStudent from "../../store/Students/act/actDeleteStudent";
import { selectStudentsState, resetStudentsError } from "../../store/Students/studentsSlice";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";
import { useSnackbar } from "../../Context/SnackbarContext";

export const useStudentManagement = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { students, loading, error } = useAppSelector(selectStudentsState);
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute } = useAppSelector((state) => state.institutes);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<CreateStudentResponse | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<CreateStudentResponse | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
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

  // Sort students first, then filter
  const filteredStudents = useMemo(() => {
    // Sort students descending by enrollmentDate
    const sortedStudents = [...students].sort((a, b) => {
      const dateA = a.enrollmentDate ? new Date(a.enrollmentDate).getTime() : 0;
      const dateB = b.enrollmentDate ? new Date(b.enrollmentDate).getTime() : 0;
      return dateB - dateA;
    });

    // Filter the sorted students
    if (!searchTerm.trim()) return sortedStudents;
    
    const term = searchTerm.toLowerCase();
    return sortedStudents.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const enrollmentDate = (student.enrollmentDate || "").toLowerCase();
      const email = (student.email || "").toLowerCase();
      const username = (student.username || "").toLowerCase();
      const contactInfo = (student.contactInfo || "").toLowerCase();
      return (
        fullName.includes(term) || 
        enrollmentDate.includes(term) || 
        email.includes(term) ||
        username.includes(term) ||
        contactInfo.includes(term)
      );
    });
  }, [students, searchTerm]);

  const handleAddStudent = useCallback(
    (data: CreateStudentResponse) => {
      setIsAddOpen(false);
    },
    [],
  );

  const handleViewClick = useCallback((student: CreateStudentResponse) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewOpen(false);
  }, []);

  const handleEditClick = useCallback((student: CreateStudentResponse) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setPendingImageFile(null);
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

  const handleSaveEdit = useCallback(async (formData: CreateStudentResponse) => {
    if (!selectedStudent || !selectedStudent.id) return;

    console.log("[DEBUG useStudentManagement] handleSaveEdit called with formData:", formData);

    // Merge existing student data with form data
    const mergedData = {
      ...selectedStudent,
      ...formData,
    };
    console.log("[DEBUG useStudentManagement] Merged data:", mergedData);

    // Build update payload for API
    const updatePayload: UpdateStudentRequest = {
      firstName: mergedData.firstName,
      lastName: mergedData.lastName,
      username: mergedData.username,
      gender: mergedData.gender,
      birthDate: mergedData.birthDate,
      address: mergedData.address,
      bio: mergedData.bio,
      interest: mergedData.interest,
      profilePicture: pendingImageFile ?? undefined,
    };
    console.log("Update payload:", updatePayload);

    setIsUpdating(true);
    try {
      const resultAction = await dispatch(
        actUpdateStudent({ id: selectedStudent.id, data: updatePayload })
      );

      if (actUpdateStudent.fulfilled.match(resultAction)) {
        showSnackbar("تم تحديث بيانات الطالب بنجاح", "success");
        setIsEditOpen(false);
        setPendingImageFile(null);
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء تحديث البيانات";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("[DEBUG useStudentManagement] handleSaveEdit error:", error);
      showSnackbar("حدث خطأ أثناء تحديث البيانات", "error");
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, showSnackbar, selectedStudent, pendingImageFile]);

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
        if (currentInstitute?.tenantId) {
          dispatch(actGetStudents(currentInstitute.tenantId));
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
  }, [dispatch, studentToDelete, showSnackbar, studentsWithActiveCourses]);

  const handleOpenAdd = useCallback(() => {
    setIsAddOpen(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  return {
    students,
    filteredStudents,
    searchTerm,
    setSearchTerm,
    selectedStudent,
    studentToDelete,
    isAddOpen,
    isEditOpen,
    isDeleteOpen,
    isViewOpen,
    loading,
    error,
    isUpdating,
    pendingImageFile,
    setPendingImageFile,
    handleAddStudent,
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
    studentsWithActiveCourses,
    deleteErrorMessage,
  };
};
