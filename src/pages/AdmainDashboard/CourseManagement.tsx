import { Box } from "@mui/material";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import AddCourseModal from "../../components/AdminDasboard/Courses/AddCourseModel";
import CourseDetailsModal from "../../components/AdminDasboard/Courses/CourseDetailsModal";
import {  useState, useCallback } from "react";
import EditCourseModal from "../../components/AdminDasboard/Courses/EditCourseModel";
import { useCourseManagement } from "../../hooks/adminDashboard/useCourseManagement";
import CourseManagementHeader from "../../components/AdminDasboard/Courses/CourseManagement/CourseManagementHeader";
import CourseManagementGrid from "../../components/AdminDasboard/Courses/CourseManagement/CourseManagementGrid";

import AddSessionModal from "../../components/AdminDasboard/Courses/AddSessionModal";
import SessionDetailsModal from "../../components/AdminDasboard/Courses/SessionDetailsModal";
import SessionsListModal from "../../components/AdminDasboard/Courses/SessionsListModal";
import SchedulingConflictDialog from "../../components/AdminDasboard/Courses/SchedulingConflictDialog";
import { TCourse, TSession } from "../../types/cardType";

const CourseManagement = () => {
  const {
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
    tenantId,
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
  } = useCourseManagement();

  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [sessionTargetCourse, setSessionTargetCourse] =
    useState<TCourse | null>(null);
  
  const [selectedSession, setSelectedSession] = useState<TSession | null>(null);
  const [editingSession, setEditingSession] = useState<TSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<{ session: TSession, course: TCourse } | null>(null);
  const [isDeleteSessionOpen, setIsDeleteSessionOpen] = useState(false);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [isSessionsListOpen, setIsSessionsListOpen] = useState(false);

  const handleOpenAddSession = (course: TCourse) => {
    setSessionTargetCourse(course);
    setEditingSession(null);
    setIsAddSessionOpen(true);
  };

  const handleOpenEditSession = (session: TSession, course: TCourse) => {
    setSessionTargetCourse(course);
    setEditingSession(session);
    setIsAddSessionOpen(true);
  };

  const handleCloseAddSession = () => {
    setIsAddSessionOpen(false);
    setSessionTargetCourse(null);
    setEditingSession(null);
  };

  const handleOpenSessionsList = (course: TCourse) => {
    setSessionTargetCourse(course);
    setIsSessionsListOpen(true);
    handleFetchSessions(course.id);
  };

  const handleSessionClick = useCallback((session: TSession, course: TCourse) => {
    setSessionTargetCourse(course);
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  }, []);

  const handleLocalUpdateSession = useCallback((updatedSession: TSession) => {
    handleUpdateSession(updatedSession);
    setSelectedSession(updatedSession);
  }, [handleUpdateSession]);

  const handleDeleteSessionRequest = useCallback((session: TSession, course: TCourse) => {
    setSessionToDelete({ session, course });
    setIsDeleteSessionOpen(true);
  }, []);

  const handleConfirmDeleteSession = useCallback(async () => {
    if (!sessionToDelete) return;
    const { session, course } = sessionToDelete;
    const success = await handleDeleteSession(course.id, session.id);
    if (success) {
      setIsDeleteSessionOpen(false);
      setSessionToDelete(null);
    }
  }, [sessionToDelete, handleDeleteSession]);

  const handleCloseDeleteSession = useCallback(() => {
    setIsDeleteSessionOpen(false);
    setSessionToDelete(null);
    handleClearDeleteSessionState();
  }, [handleClearDeleteSessionState]);

  return (
    <Box sx={{  width: "100%", overflowX: "hidden", flexGrow: 1 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <CourseManagementHeader 
          onAddClick={handleOpenAdd}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          isSearchLoading={searchLoading === "pending"}
        />

      {openAddModal && (
        <AddCourseModal
          open={openAddModal}
          onClose={handleCloseAdd}
          onSave={handleSaveAdd}
          isLoading={createLoading === "pending"}
        />
      )}

      {isAddSessionOpen && (
        <AddSessionModal
          open={isAddSessionOpen}
          onClose={handleCloseAddSession}
          course={sessionTargetCourse}
          onSave={(data) => {
            if (editingSession) {
              // Map status to Arabic for TSession
              const statusMap: Record<string, any> = {
                "UPCOMING": "قيد الانتظار",
                "ACTIVE": "نشطة",
                "COMPLETED": "مكتملة"
              };
              handleUpdateSession({
                ...editingSession,
                ...data,
                status: statusMap[data.status as string],
                minCapacity: data.minSeats,
                sessionsCount: data.numberOfLectures,
                hall: "", // We don't have hall from form data, keep existing or empty
              } as TSession);
              handleCloseAddSession();
            } else {
              handleAddSession(data, handleCloseAddSession);
            }
          }}
          initialSession={editingSession}
          isLoading={creatingSession}
        />
      )}

      <SchedulingConflictDialog
        open={openConflictDialog}
        onClose={handleCloseConflictDialog}
        conflictData={conflictData}
        onSelectSuggestion={handleSelectSuggestion}
        submitting={submittingSuggestion}
        onSuccess={handleCloseAddSession}
      />

      {isSessionDetailsOpen && (
        <SessionDetailsModal
          open={isSessionDetailsOpen}
          onClose={() => setIsSessionDetailsOpen(false)}
          session={selectedSession}
          course={sessionTargetCourse || { id: 0, title: "", category: "", categoryName: "", price: 0, requirements: "", students: "", description: "", image: "", institute: "", lecturesCount: 0, hours: 0, instructor: { id: 0, name: "", title: "", image: "", email: "", phone: "", certificates: [], studentsCount: 0, courseCount: 0, experienceYears: 0, rating: 0, bio: "" }, reviews: [], sessions: [] }}
          onUpdateSession={handleLocalUpdateSession}
        />
      )}

      {isSessionsListOpen && (
        <SessionsListModal
          open={isSessionsListOpen}
          onClose={() => setIsSessionsListOpen(false)}
          course={sessionTargetCourse}
          onEditSession={handleOpenEditSession}
          onDeleteSession={handleDeleteSessionRequest}
          onSessionClick={handleSessionClick}
        />
      )}

      {isDeleteOpen && (
        <GenericDeleteModal
          open={isDeleteOpen}
          onClose={handleCloseDelete}
          onConfirm={handleDeleteCourse}
          title="تأكيد حذف الكورس"
          description="هل أنت متأكد من رغبتك في حذف الكورس"
          itemName={selectedCourse?.title}
          isLoading={deletingCourseId === selectedCourse?.id}
          errorMessage={deleteError}
        />
      )}

      {isDeleteSessionOpen && (
        <GenericDeleteModal
          open={isDeleteSessionOpen}
          onClose={handleCloseDeleteSession}
          onConfirm={handleConfirmDeleteSession}
          title="تأكيد حذف الدورة"
          description="هل أنت متأكد من رغبتك في حذف الدورة"
          itemName={sessionToDelete?.session.title}
          isLoading={deletingSessionId === sessionToDelete?.session.id}
          errorMessage={sessionDeleteError}
        />
      )}

      {openDetailsModal && (
        <CourseDetailsModal
          open={openDetailsModal}
          onClose={handleCloseDetail}
          course={selectedCourse}
          onSave={handleSaveEdit}
          onAddSession={handleOpenAddSession}
          tenantId={tenantId}
          isSaving={updateLoading === "pending"}
        />
      )}

      {openEditModal && (
        <EditCourseModal
          open={openEditModal}
          onClose={handleCloseEdit}
          course={selectedCourse}
          onSave={(data) => handleSaveEdit(data, handleCloseEdit)}
          tenantId={tenantId}
          isLoading={updateLoading === "pending"}
        />
      )}

      <CourseManagementGrid
        courses={courses}
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
        onAddSession={handleOpenAddSession}
        onShowSessions={handleOpenSessionsList}
        onDelete={handleDeleteClick}
        loading={adminCoursesLoading === "pending" || searchLoading === "pending"}
      />

      
    </Box>
    </Box>
  );
};

export default CourseManagement;
