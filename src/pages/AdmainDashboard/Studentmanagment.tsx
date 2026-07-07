import React, { memo, useMemo } from "react";
import { Grid, Box, TextField, InputAdornment, IconButton } from "@mui/material";
import StudentsTable from "../../components/AdminDasboard/students/StudentsTable";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import StudentDetailsModal from "../../components/AdminDasboard/students/StudentDetailsModal";
import AddStudentModal from "../../components/AdminDasboard/students/AddStudentModal";
import { useStudentManagement } from "../../hooks/adminDashboard/useStudentManagement";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import StudentManagementHeader from "../../components/AdminDasboard/students/SubComponents/StudentManagementHeader";

const Studentmanagment: React.FC = () => {
  const {
    students,
    filteredStudents,
    paginatedStudents,
    searchTerm,
    setSearchTerm,
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
    rowsPerPage,
    studentsCount,
    studentsCountLoading,
    studentsCountError,
    activeStudentsCount,
    activeStudentsCountLoading,
    activeStudentsCountError,
  } = useStudentManagement();
  
  const showLoading = useDelayedLoading(loading);

  const statsCards = useMemo(
    () => [
      {
        title: "إجمالي الطلاب",
        value: studentsCountLoading ? "..." : (studentsCountError ? "خطأ" : `${studentsCount ?? 0}`),
        icon: <GroupIcon />,
        color: "#2196f3",
      },
      {
        title: "الطلاب النشطون",
        value: activeStudentsCountLoading ? "..." : (activeStudentsCountError ? "خطأ" : `${activeStudentsCount ?? 0}`),
        icon: <PersonIcon />,
        color: "#4caf50",
      },
    ],
    [studentsCount, studentsCountLoading, studentsCountError, activeStudentsCount, activeStudentsCountLoading, activeStudentsCountError, students.length],
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

      {/* Search Field */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="ابحث عن طالب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#666" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm("")} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: "400px",
            backgroundColor: "transparent",
            borderRadius: "12px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-root": {
              backgroundColor: "transparent",
              fontFamily: "Tajawal",
              fontSize: "16px",
            },
            "& .MuiInputBase-input": {
              py: 1.5,
              px: 2,
              "&::placeholder": {
                color: "#555",
                opacity: 1,
                fontWeight: 500,
              },
            },
          }}
        />
      </Box>

      <StudentsTable
        studentsData={paginatedStudents}
        onView={handleViewClick}
        onDelete={handleDeleteClick}
        loading={loading}
        showLoading={showLoading}
        hasData={students.length > 0}
        searchLoading={searchLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
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

      <GenericDeleteModal
        open={isDeleteOpen}
        itemName={studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : ""}
        description="هل أنت متأكد من رغبتك في حذف الطالب"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        errorMessage={deleteErrorMessage}
      />
    </Box>
  );
};

export default memo(Studentmanagment);


