import React, { memo, useMemo } from "react";
import { Box, Grid, Container, Stack, Button, Typography, CircularProgress, Alert } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CardMembershipIcon from "@mui/icons-material/CardMembership";

import { WeeklyScheduleItem, Day } from "../../types/studentDashboard";

const getDynamicDays = (): Day[] => {
  const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  return daysOfWeek.map((name, index) => ({
    name,
    date: startOfWeek.getDate() + index,
  }));
};

import EditStudentModal from "../../components/AdminDasboard/students/EditStudentModal";
import StatCard from "../../components/StudentDashboard/StatCard";
import CourseActivityCard from "../../components/StudentDashboard/CourseActivityCard";
import PersonalInfo from "../../components/StudentDashboard/PersonalInfo";
import StudentProfileHeader from "../../components/StudentDashboard/StudentProfileHeader";
import StudentSchedule from "../../components/StudentDashboard/StudentSchedule";
import { useStudentDashboard } from "../../hooks/studentDashboard/useStudentDashboard";

const formatTime = (timeObj: { hour: number; minute: number }): string => {
  const hour = String(timeObj.hour).padStart(2, "0");
  const minute = String(timeObj.minute).padStart(2, "0");
  return `${hour}:${minute}`;
};

const StudentDashboard = () => {
  const {
    student,
    loading,
    error,
    updateLoading,
    updateError,
    success,
    imageUpdateLoading,
    openEdit,
    handleSave,
    handleImageUpdate,
    setPendingImageFile,
    handleOpenEdit,
    handleCloseEdit,
    trainingHours,
    trainingHoursLoading,
    completionPercentage,
    completionPercentageLoading,
    weeklySchedule,
    scheduleLoading,
    scheduleError,
    activeCourses,
    activeCoursesLoading,
    activeCoursesError,
  } = useStudentDashboard();

  const lecturesData = useMemo(() => {
    console.log("[DEBUG StudentDashboard] weeklySchedule:", weeklySchedule);
    const data: Record<string, any[]> = {};
    weeklySchedule.forEach((item: WeeklyScheduleItem) => {
      if (!data[item.day]) {
        data[item.day] = [];
      }
      data[item.day].push({
        title: item.courseName,
        startTime: formatTime(item.startTime),
        endTime: formatTime(item.endTime),
        teacherName: item.teacherName,
        instructor: item.teacherName,
        room: item.room,
      });
    });
    console.log("[DEBUG StudentDashboard] lecturesData:", data);
    return data;
  }, [weeklySchedule]);

  if (loading) {
    return (
      <Box sx={{ 
        pt: 12, 
        direction: "rtl",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography sx={{ fontFamily: "Tajawal" }}>جاري تحميل البيانات...</Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        pt: 12, 
        direction: "rtl",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2
      }}>
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      pt: 12, 
      direction: "rtl",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
      pb: 6
    }}>
      <Container maxWidth="lg">
        <StudentProfileHeader
          student={student}
          onEdit={handleOpenEdit}
        />

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="الدورات الحالية"
              value={activeCoursesLoading ? "..." : `${activeCourses.length}`}
              icon={<SchoolIcon />}
              color="#ff5722"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="ساعات التدريب"
              value={trainingHoursLoading ? "..." : `${trainingHours}`}
              icon={<AccessTimeIcon />}
              color="#2196f3"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="نسبة الإكمال العام"
              value={completionPercentageLoading ? "..." : `${completionPercentage}%`}
              icon={<DoneAllIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="الشهادات المكتسبة"
              value="2"
              icon={<CardMembershipIcon />}
              color="#3f51b5"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={6}>
          <Grid size={{ xs: 12, md: 5 }}>
            <PersonalInfo student={student} />
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack
              direction="row-reverse"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Button
                sx={{
                  color: "#2196f3",
                  fontWeight: "bold",
                  fontFamily: "Tajawal",
                }}
              >
                عرض الكل
              </Button>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: "#091c39",
                  fontFamily: "Tajawal",
                }}
              >
                دوراتي النشطة
              </Typography>
            </Stack>

            {activeCoursesLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, fontFamily: "Tajawal" }}>جاري تحميل الدورات النشطة...</Typography>
              </Box>
            ) : activeCoursesError ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>{activeCoursesError}</Alert>
              </Box>
            ) : activeCourses.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography sx={{ fontFamily: "Tajawal" }}>لا توجد دورات نشطة حالياً</Typography>
              </Box>
            ) : (
              activeCourses.map((course) => (
                <CourseActivityCard key={course.id} {...course} />
              ))
            )}
          </Grid>
        </Grid>

        {(() => {
          console.log("[DEBUG StudentDashboard] scheduleLoading:", scheduleLoading);
          console.log("[DEBUG StudentDashboard] scheduleError:", scheduleError);
          console.log("[DEBUG StudentDashboard] weeklySchedule.length:", weeklySchedule.length);
          
          if (scheduleLoading) {
            return (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, fontFamily: "Tajawal" }}>جاري تحميل الجدول...</Typography>
              </Box>
            );
          } else if (scheduleError) {
            return (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>{scheduleError}</Alert>
              </Box>
            );
          } else if (weeklySchedule.length === 0) {
            return (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ fontFamily: "Tajawal" }}>لا يوجد جدول دراسي حالياً</Typography>
              </Box>
            );
          } else {
            const dynamicDays = getDynamicDays();
            return (
              <StudentSchedule
                days={dynamicDays}
                lecturesData={lecturesData}
              />
            );
          }
        })()}
      </Container>

      <EditStudentModal
        open={openEdit}
        onClose={handleCloseEdit}
        student={student}
        onSave={handleSave}
        onImageUpdate={handleImageUpdate}
        loading={updateLoading}
        success={success}
        error={updateError}
        setPendingImageFile={setPendingImageFile}
        imageUpdateLoading={imageUpdateLoading}
      />
    </Box>
  );
};

export default memo(StudentDashboard);
