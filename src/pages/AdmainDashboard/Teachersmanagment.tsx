import React, { memo, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import TeachersTable from "../../components/AdminDasboard/Teachers/TeachersTable";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import { statsTeacher } from "../../data/TeacherData";
import EditTeacherModal from "../../components/AdminDasboard/Teachers/EditTeacherModal";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import TeacherDetailsModal from "../../components/AdminDasboard/Teachers/TeacherDetailsModal";
import AddTeachersModal from "../../components/AdminDasboard/Teachers/AddTeachersModal";
import { useTeacherManagement } from "../../hooks/adminDashboard/useTeacherManagement";
import TeacherManagementHeader from "../../components/AdminDasboard/Teachers/SubComponents/TeacherManagementHeader";

const TeachersManagement: React.FC = () => {
  const {
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
  } = useTeacherManagement();

  const statsCards = useMemo(
    () =>
      statsTeacher.map((s, index) => {
        let updatedValue = s.value;
        if (s.title === "اجمالي المعلمين") {
          updatedValue = teachers.length.toString();
        }
        if (s.title === "المدربون النشطون") {
          const activeCount = teachers.filter(t => (t.numberOfStudents || 0) > 0).length;
          updatedValue = `${activeCount} `;
        }
        return (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
            <Card item={{ ...s, value: updatedValue }} />
          </Grid>
        );
      }),
    [teachers],
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
      <TeacherManagementHeader onAddClick={handleOpenAdd} />

      <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {statsCards}
      </Grid>

      <TeachersTable
        teachersData={filteredTeachers}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <AddTeachersModal
        open={isAddOpen}
        onClose={handleCloseAdd}
        onSave={handleAddTeacher}
      />

      <TeacherDetailsModal
        open={isViewOpen}
        teacher={selectedTeacher}
        loading={selectedTeacherLoading}
        onClose={handleCloseView}
      />

      {localEditTeacher && (
        <EditTeacherModal
          key={localEditTeacher.id}
          open={isEditOpen}
          teacher={localEditTeacher}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}

      <GenericDeleteModal
        open={isDeleteOpen}
        itemName={teacherToDelete?.name}
        description="هل أنت متأكد من رغبتك في حذف المعلم"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default memo(TeachersManagement);


