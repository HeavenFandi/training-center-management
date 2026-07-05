import React, { memo, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Stack,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";

import { WeeklyScheduleItem, Day } from "../../types/studentDashboard";

const getDynamicDays = (referenceDate: Date = new Date()): Day[] => {
  const daysOfWeek = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());

  return daysOfWeek.map((name, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);

    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    return {
      name,
      date: currentDate.getDate(),
      dateString,
      fullDate: currentDate,
    };
  });
};

import EditStudentModal from "../../components/AdminDasboard/students/EditStudentModal";
import StatCard from "../../components/StudentDashboard/StatCard";
import CourseActivityCard from "../../components/StudentDashboard/CourseActivityCard";
import PersonalInfo from "../../components/StudentDashboard/PersonalInfo";
import StudentProfileHeader from "../../components/StudentDashboard/StudentProfileHeader";
import StudentSchedule from "../../components/StudentDashboard/StudentSchedule";
import { useStudentDashboard } from "../../hooks/studentDashboard/useStudentDashboard";

const formatTime = (time: any): string => {
  console.log("[DEBUG formatTime] Input time:", time, typeof time);

  // Case 1: Time is a string like "HH:mm:ss" or "HH:mm"
  if (typeof time === "string") {
    return time.substring(0, 5); // "09:00:00" → "09:00"
  }

  // Case 2: Time is an object with hour/minute properties (TimeObject)
  if (typeof time === "object" && time !== null) {
    const hour = String(time.hour ?? time.hours ?? 0).padStart(2, "0");
    const minute = String(time.minute ?? time.minutes ?? 0).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  return "";
};

const StudentDashboard = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [viewAllOpen, setViewAllOpen] = useState(false);

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
  } = useStudentDashboard({ referenceDate: currentDate });

  // Helper to check if two dates are in the same week
  const isSameWeek = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const startOfWeek1 = new Date(d1);
    startOfWeek1.setDate(d1.getDate() - d1.getDay());
    const startOfWeek2 = new Date(d2);
    startOfWeek2.setDate(d2.getDate() - d2.getDay());
    return startOfWeek1.getTime() === startOfWeek2.getTime();
  };

  // Update currentDate ONLY on initial load if we have schedule data and currentDate isn't already in that week
  const [hasInitialized, setHasInitialized] = React.useState(false);
  React.useEffect(() => {
    if (
      !hasInitialized &&
      weeklySchedule.length > 0 &&
      weeklySchedule[0].lectureDate
    ) {
      const lectureDate = new Date(weeklySchedule[0].lectureDate);
      if (!isSameWeek(currentDate, lectureDate)) {
        setCurrentDate(lectureDate);
      }
      setHasInitialized(true);
    }
  }, [weeklySchedule, currentDate, hasInitialized]);

  const lecturesData = useMemo(() => {
    console.log("[DEBUG StudentDashboard] weeklySchedule:", weeklySchedule);
    const data: Record<string, any[]> = {};
    weeklySchedule.forEach((item: WeeklyScheduleItem) => {
      console.log("[DEBUG StudentDashboard] Processing session:", {
        lectureDate: item.lectureDate,
        day: item.day,
        courseName: item.courseName,
      });

      const key = item.lectureDate || item.day;
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push({
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
      <Box
        sx={{
          pt: 12,
          direction: "rtl",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography sx={{ fontFamily: "Tajawal" }}>
            جاري تحميل البيانات...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          pt: 12,
          direction: "rtl",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        pt: 12,
        direction: "rtl",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F0F4F8 0%, #D9E2EC 100%)",
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <StudentProfileHeader student={student} />

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="الدورات الحالية"
              value={activeCoursesLoading ? "..." : `${activeCourses.length}`}
              icon={<SchoolIcon />}
              color="#ff5722"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="ساعات التدريب"
              value={trainingHoursLoading ? "..." : `${trainingHours}`}
              icon={<AccessTimeIcon />}
              color="#2196f3"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="نسبة الإكمال العام"
              value={
                completionPercentageLoading ? "..." : `${completionPercentage}%`
              }
              icon={<DoneAllIcon />}
              color="#4caf50"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={6}>
          <Grid size={{ xs: 12, md: 5 }}>
            <PersonalInfo student={student} onEdit={handleOpenEdit} />
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack
              direction="row-reverse"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              {activeCourses.length > 3 && (
                <Button
                  onClick={() => setViewAllOpen(true)}
                  sx={{
                    color: "#2196f3",
                    fontWeight: "bold",
                    fontFamily: "Tajawal",
                  }}
                >
                  عرض الكل
                </Button>
              )}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: "#091c39",
                  fontFamily: "Tajawal",
                }}
              >
                دوراتي التدريبية
              </Typography>
            </Stack>

            {activeCoursesLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, fontFamily: "Tajawal" }}>
                  جاري تحميل الدورات النشطة...
                </Typography>
              </Box>
            ) : activeCoursesError ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>
                  {activeCoursesError}
                </Alert>
              </Box>
            ) : activeCourses.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography sx={{ fontFamily: "Tajawal" }}>
                  لا توجد دورات نشطة حالياً
                </Typography>
              </Box>
            ) : (
              activeCourses
                .slice(0, 3)
                .map((course, index) => (
                  <CourseActivityCard
                    key={
                      course.trainingSessionId ||
                      course.courseName ||
                      `${index}`
                    }
                    {...course}
                  />
                ))
            )}
          </Grid>
        </Grid>

        {(() => {
          console.log(
            "[DEBUG StudentDashboard] scheduleLoading:",
            scheduleLoading,
          );
          console.log("[DEBUG StudentDashboard] scheduleError:", scheduleError);
          console.log(
            "[DEBUG StudentDashboard] weeklySchedule.length:",
            weeklySchedule.length,
          );

          if (scheduleError) {
            return (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>
                  {scheduleError}
                </Alert>
              </Box>
            );
          }

          // Always render StudentSchedule, even if no lectures
          const dynamicDays = getDynamicDays(currentDate);

          const handlePrevWeek = () => {
            setCurrentDate((prev) => {
              const newDate = new Date(prev);
              newDate.setDate(newDate.getDate() - 7);
              return newDate;
            });
          };

          const handleNextWeek = () => {
            setCurrentDate((prev) => {
              const newDate = new Date(prev);
              newDate.setDate(newDate.getDate() + 7);
              return newDate;
            });
          };

          return (
            <StudentSchedule
              days={dynamicDays}
              lecturesData={lecturesData}
              referenceDate={currentDate}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              isEmpty={weeklySchedule.length === 0}
              loading={scheduleLoading}
            />
          );
        })()}
      </Container>

      <Dialog
        open={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        fullWidth
        maxWidth="md"
        dir="rtl"
        PaperProps={{
          sx: { borderRadius: "28px", p: 0.5 },
        }}
      >
        <Box
          sx={{
            p: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#F8FAFC",
          }}
        >
          <Typography variant="h6" fontWeight="900" color="#133E65">
            دوراتي التدريبية
          </Typography>
          <IconButton
            onClick={() => setViewAllOpen(false)}
            sx={{ bgcolor: "#fff" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent
          sx={{ p: 4, pt: 2, overflowY: "auto", bgcolor: "#F8FAFC" }}
        >
          {activeCourses.map((course, index) => (
            <CourseActivityCard
              key={course.trainingSessionId || course.courseName || `${index}`}
              {...course}
            />
          ))}
        </DialogContent>
      </Dialog>

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
