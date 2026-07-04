import React, { memo, useMemo } from "react";
import { Box, Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import TeachersTable from "../../components/AdminDasboard/Teachers/TeachersTable";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import { statsTeacher } from "../../data/TeacherData";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import TeacherDetailsModal from "../../components/AdminDasboard/Teachers/TeacherDetailsModal";
import AddTeachersModal from "../../components/AdminDasboard/Teachers/AddTeachersModal";
import { useTeacherManagement } from "../../hooks/adminDashboard/useTeacherManagement";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import TeacherManagementHeader from "../../components/AdminDasboard/Teachers/SubComponents/TeacherManagementHeader";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const TeachersManagement: React.FC = () => {
  const {
    teachers,
    filteredTeachers,
    paginatedTeachers,
    searchTerm,
    setSearchTerm,
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
    rowsPerPage,
  } = useTeacherManagement();
  
  const showLoading = useDelayedLoading(loading);
  const showTeacherLoading = useDelayedLoading(selectedTeacherLoading);

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

      {/* Search Field */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="ابحث عن معلم..."
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

      <TeachersTable
        teachersData={paginatedTeachers}
        onView={handleViewClick}
        onDelete={handleDeleteClick}
        loading={loading}
        showLoading={showLoading}
        hasData={teachers.length > 0}
        searchLoading={searchLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
      />

      <AddTeachersModal
        open={isAddOpen}
        onClose={handleCloseAdd}
        onSave={handleAddTeacher}
      />

      <TeacherDetailsModal
        open={isViewOpen}
        teacher={selectedTeacher}
        loading={showTeacherLoading}
        hasData={!!selectedTeacher}
        onClose={handleCloseView}
      />

      <GenericDeleteModal
        open={isDeleteOpen}
        itemName={`${teacherToDelete?.firstName || ""} ${teacherToDelete?.lastName || ""}`.trim()}
        description="هل أنت متأكد من رغبتك في حذف المعلم"
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default memo(TeachersManagement);


