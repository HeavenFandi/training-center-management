import React, { memo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/Auth/authSlice";
import { useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import actGetTeacherById from "../../store/teachers/act/actGetTeacherById";
import actGetTeacherCourseProgress from "../../store/teachers/act/actGetTeacherCourseProgress";
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ title, value, icon, iconBg }: StatCardProps) => (
  <Paper
    sx={{
      p: 2,
      textAlign: "center",
      borderRadius: 4,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      height: 105,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        transform: "translateY(-5px)",
      },
    }}>
    <Box
      sx={{
        color: iconBg,
        mb: 0.5,
        display: "flex",
        justifyContent: "center",
      }}>
      {React.cloneElement(icon as React.ReactElement)}
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight="bold"
      sx={{ fontFamily: "Tajawal", fontSize: 12 }}>
      {title}
    </Typography>
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{ fontFamily: "Tajawal", fontSize: 20 }}>
      {value}
    </Typography>
  </Paper>
);

interface CourseCardProps {
  title: string;
  image: string;
  progress: number;
  progressColor: string;
  studentsCount: number;
  completedSessions: number;
  totalSessions: number;
}

const CourseCard = ({
  title,
  image,
  progress,
  progressColor,
  studentsCount,
  completedSessions,
  totalSessions,
}: CourseCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: "24px",
      overflow: "hidden",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
    }}>
    <Box sx={{ p: 1.5 }}>
      <Box
        component="img"
        src={
          image ||
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
        }
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop";
        }}
        sx={{
          width: "100%",
          height: 110,
          objectFit: "cover",
          borderRadius: "16px",
        }}
      />
    </Box>

    <CardContent sx={{ p: "0 20px 20px 20px !important" }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 900,
          color: "#1e293b",
          mb: 2,
          textAlign: "right",
          fontFamily: "Tajawal",
        }}>
        {title}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={1}>
            <Groups2OutlinedIcon sx={{ fontSize: 20, color: "#1e293b" }} />
            <Typography
              sx={{
                fontSize: 12,
                color: "#1e293b",
                fontWeight: 700,
                fontFamily: "Tajawal",
              }}>
              {studentsCount} طالب
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <AccessTimeRoundedIcon sx={{ fontSize: 20, color: "#1e293b" }} />
            <Typography
              sx={{
                fontSize: 12,
                color: "#1e293b",
                fontWeight: 700,
                fontFamily: "Tajawal",
              }}>
              {completedSessions}/{totalSessions} جلسة
            </Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 900,
            color: progressColor,
            fontFamily: "Tajawal",
          }}>
          {progress}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 10,
          bgcolor: "#f1f5f9",
          transform: "scaleX(-1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            bgcolor: progressColor,
          },
        }}
      />
    </CardContent>
  </Card>
);

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const { selectedTeacher, courseProgress } = useAppSelector(
    (state) => state.teachers,
  );
  const displayedCourses = showAllCourses
    ? courseProgress
    : courseProgress.slice(0, 6);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.id) {
      dispatch(actGetTeacherById(user.teacherId));
      dispatch(actGetTeacherCourseProgress(user.teacherId));
    }
  }, [dispatch]);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const averageProgress =
    courseProgress.length > 0
      ? Math.round(
          courseProgress.reduce(
            (sum, course) => sum + course.progressPercentage,
            0,
          ) / courseProgress.length,
        )
      : 0;
  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        p: { xs: 1.5, md: 2.5 },
      }}>
      <Box sx={{ mx: "auto", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontSize: { xs: 20, md: 24 },
                fontWeight: 900,
                color: "#1e293b",
                mb: 0.5,
                fontFamily: "Tajawal",
              }}>
              مرحباً أستاذ {selectedTeacher?.firstName || ""}{" "}
              {selectedTeacher?.lastName || ""}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 13, md: 14 },
                color: "#64748b",
                fontWeight: 600,
                fontFamily: "Tajawal",
              }}>
              إليك ملخص نشاطك التعليمي لهذا اليوم
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon sx={{ ml: 1 }} />}
            onClick={handleLogout}
            sx={{
              borderRadius: "12px",
              fontWeight: "bold",
              px: { xs: 2, md: 3 },
              borderWidth: "2px",
              fontFamily: "Tajawal",
              "&:hover": {
                borderWidth: "2px",
                backgroundColor: "rgba(211, 47, 47, 0.04)",
              },
            }}>
            تسجيل الخروج
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatCard
              title="الدورات الحالية"
              value={`${courseProgress.length} دورات`}
              icon={<LibraryBooksRoundedIcon />}
              iconBg="#FF8B61"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatCard
              title="اجمالي الطلاب"
              value={`${selectedTeacher?.numberOfStudents ?? 0} طالب`}
              icon={<Diversity3RoundedIcon />}
              iconBg="#B27CFF"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatCard
              title="نسبة تقدم الطلاب"
              value={`${averageProgress}%`}
              icon={<DonutLargeRoundedIcon />}
              iconBg="#54C26A"
            />
          </Grid>
        </Grid>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 900,
              color: "#4A7FA7",
              fontFamily: "Tajawal",
            }}>
            الدورات الحالية
          </Typography>
          {courseProgress.length > 6 && (
            <Typography
              onClick={() => setShowAllCourses(!showAllCourses)}
              sx={{
                cursor: "pointer",
                color: "#4A7FA7",
                fontWeight: 700,
                fontFamily: "Tajawal",
                "&:hover": {
                  color: "#1e293b",
                },
              }}>
              {showAllCourses ? "عرض أقل" : "عرض الجميع"}
            </Typography>
          )}
        </Stack>

        <Grid container spacing={2}>
          {displayedCourses.map((course) => (
            <Grid
              key={course.trainingSessionId}
              size={{ xs: 12, sm: 6, md: 4 }}>
              <CourseCard
                title={course.courseName}
                image={course.image}
                progress={course.progressPercentage}
                progressColor={
                  course.progressPercentage >= 70
                    ? "#54C26A"
                    : course.progressPercentage >= 40
                      ? "#3B82F6"
                      : "#FF8B61"
                }
                studentsCount={course.numberOfStudents}
                completedSessions={course.lecturesGiven}
                totalSessions={course.totalLectures}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(TeacherDashboard);
