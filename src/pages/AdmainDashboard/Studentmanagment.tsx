import React, { memo, useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import StudentsTable from "../../components/AdminDasboard/students/StudentsTable";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import EditStudentModal from "../../components/AdminDasboard/students/EditStudentModal";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import StudentDetailsModal from "../../components/AdminDasboard/students/StudentDetailsModal";
import AddStudentModal from "../../components/AdminDasboard/students/AddStudentModal";
import { useStudentManagement } from "../../hooks/adminDashboard/useStudentManagement";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

import StudentManagementHeader from "../../components/AdminDasboard/students/SubComponents/StudentManagementHeader";

const Studentmanagment: React.FC = () => {
  const {
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
  } = useStudentManagement();

  const statsCards = useMemo(
    () => [
      {
        title: "إجمالي الطلاب",
        value: `${students.length}`,
        icon: <GroupIcon />,
        color: "#2196f3",
      },
      {
        title: "الطلاب النشطون",
        value: `${students.length}`,
        icon: <PersonIcon />,
        color: "#4caf50",
      },
    ],
    [students.length],
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
      <StudentManagementHeader onAddClick={handleOpenAdd} />

      <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {statsCards.map((s, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
            <Card item={s} />
          </Grid>
        ))}
      </Grid>

      <StudentsTable
        studentsData={filteredStudents}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <AddStudentModal
        open={isAddOpen}
        onClose={handleCloseAdd}
        onAdd={handleAddStudent}
      />

      <StudentDetailsModal
        open={isViewOpen}
        student={selectedStudent}
        onClose={handleCloseView}
      />

      {selectedStudent && (
        <EditStudentModal
          key={selectedStudent.id}
          open={isEditOpen}
          student={selectedStudent}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          loading={isUpdating}
          setPendingImageFile={setPendingImageFile}
        />
      )}

      <GenericDeleteModal
        open={isDeleteOpen}
        itemName={studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : ""}
        description="هل أنت متأكد من رغبتك في حذف الطالب"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default memo(Studentmanagment);


