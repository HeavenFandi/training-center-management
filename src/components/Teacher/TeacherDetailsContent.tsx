import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
  Rating,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectSessions,
  actGetTrainingSessions,
} from "../../store/Courses/trainingSessionsSlice";

import GroupIcon from "@mui/icons-material/Group";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";

import useTeacherDetails from "../../hooks/teacherDashboard/useTeacherDetails";

export default function TeacherDetailsContent() {
  const { teacher, teacherCourses, loading, error } = useTeacherDetails();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);

  // Fetch training sessions when component mounts if not already loaded
  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(actGetTrainingSessions());
    }
  }, [dispatch, sessions.length]);

  const handleCourseClick = (courseId: number, courseName: string) => {
    // First try to match by courseId
    let matchingSession = sessions.find((session) => {
      return session.courseId === courseId;
    });

    // If no match by courseId, try matching by courseName
    if (!matchingSession) {
      matchingSession = sessions.find((session) => {
        return session.title === courseName;
      });
    }

    if (matchingSession) {
      navigate(`/main/training-session-details/${matchingSession.id}`);
    } else {
      navigate("/main/courses");
    }
  };

  const statCardSx = {
    width: 280,
    height: 120,
    borderRadius: "20px",
    bgcolor: "#ffffff",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(232, 238, 245, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const sectionCardSx = {
    bgcolor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(232, 238, 245, 0.9)",
  } as const;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Tajawal, sans-serif",
          fontSize: "24px",
          color: "#243041",
        }}
      >
        جاري تحميل بيانات المعلم...
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Tajawal, sans-serif",
          fontSize: "24px",
          color: "#C62828",
        }}
      >
        {error}
      </Box>
    );
  }

  if (!teacher) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Tajawal, sans-serif",
          fontSize: "24px",
          color: "#243041",
        }}
      >
        لا توجد بيانات للمعلم
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
        pt: { xs: 10, md: 12 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Stack alignItems="center" spacing={1} sx={{ mb: 5 }}>
          <Avatar
            src={teacher.image || undefined}
            sx={{
              width: 90,
              height: 90,
              bgcolor: "#d1d5db",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "24px", md: "28px" },
              fontWeight: 700,
              color: "#1f2a37",
              lineHeight: 1.2,
              fontFamily: "Tajawal, sans-serif",
              textAlign: "center",
            }}
          >
            {teacher.name}
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "rgba(26, 61, 99, 1)",
              fontFamily: "Tajawal, sans-serif",
              textAlign: "center",
            }}
          >
            {teacher.title || "مدرب"}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Rating
              value={teacher.rating || 0}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffb400",
                fontFamily: "Tajawal, sans-serif",
              }}
            >
              {teacher.rating || 0}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={10} justifyContent="center" sx={{ mb: 5 }}>
          <Grid>
            <Card sx={statCardSx}>
              <Stack alignItems="center" spacing={0.8}>
                <GroupIcon sx={{ fontSize: 24, color: "#45a049" }} />

                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#93a1b2",
                    fontWeight: 500,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  الطلاب المستفيدين
                </Typography>

                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#091c39",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {teacher.studentsCount || 0} طالب
                </Typography>
              </Stack>
            </Card>
          </Grid>

          <Grid>
            <Card sx={statCardSx}>
              <Stack alignItems="center" spacing={0.8}>
                <SlowMotionVideoIcon sx={{ fontSize: 24, color: "#c6c9cf" }} />

                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#93a1b2",
                    fontWeight: 500,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  الدورات المقدمة
                </Typography>

                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#1f2a37",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  {teacherCourses.length} دورة
                </Typography>
              </Stack>
            </Card>
          </Grid>

          <Grid>
            <Card sx={statCardSx}>
              <Stack alignItems="center" spacing={0.8}>
                <TrendingUpRoundedIcon
                  sx={{ fontSize: 24, color: "#c6c9cf" }}
                />

                <Typography
                  sx={{
                    fontSize: "20px",
                    color: "#93a1b2",
                    fontWeight: 500,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  سنوات الخبرة
                </Typography>

                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#1f2a37",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  +{teacher.experienceYears || 0}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={10} justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                ...sectionCardSx,
                p: 3,
                backgroundColor: "rgba(246, 250, 253, 0.6)",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#243041",
                    lineHeight: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  الكورسات
                </Typography>

                <ClassRoundedIcon
                  sx={{ fontSize: 30, color: "rgba(22, 121, 229, 1)" }}
                />
              </Stack>

              <Stack spacing={3} mt={3}>
                {teacherCourses.length > 0 ? (
                  teacherCourses.map((course) => (
                    <Box
                      key={course.courseId}
                      onClick={() =>
                        handleCourseClick(course.courseId, course.courseName)
                      }
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        bgcolor: "rgba(255, 255, 255, 0.75)",
                        border: "1px solid rgba(232, 238, 245, 0.9)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#0b1b34",
                          lineHeight: 1.9,
                          mb: 1,
                          fontFamily: "Tajawal, sans-serif",
                          textAlign: "right",
                        }}
                      >
                        {course.courseName}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "15px",
                          color: "#122748",
                          fontWeight: 500,
                          lineHeight: 1.8,
                          fontFamily: "Tajawal, sans-serif",
                          textAlign: "right",
                          mb: 1,
                        }}
                      >
                        الجلسات المكتملة: {course.completedSessions} /{" "}
                        {course.totalSessions}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={course.progressPercentage}
                        sx={{
                          height: 8,
                          borderRadius: "999px",
                          mb: 1,
                          backgroundColor: "rgba(18, 39, 72, 0.08)",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#3C8DBC",
                          fontWeight: 700,
                          fontFamily: "Tajawal, sans-serif",
                          textAlign: "right",
                        }}
                      >
                        نسبة التقدم: %{course.progressPercentage}
                      </Typography>
                      <Typography
                        sx={{
                          pt: 1,
                          fontSize: "14px",
                          color: "#3C8DBC",
                          fontWeight: 700,
                          fontFamily: "Tajawal, sans-serif",
                          textAlign: "right",
                          mb: 1,
                        }}
                      >
                        عدد الطلاب المستفيدين: {course.numberOfStudents || 0}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      color: "#6B7280",
                      fontFamily: "Tajawal, sans-serif",
                      textAlign: "center",
                    }}
                  >
                    لا توجد كورسات لهذا المعلم حاليًا
                  </Typography>
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Card
                sx={{
                  ...sectionCardSx,
                  p: 3,
                  backgroundColor: "rgba(246, 250, 253, 0.6)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#243041",
                    lineHeight: 1.2,
                    fontFamily: "Tajawal, sans-serif",
                    textAlign: "right",
                    mb: 2,
                  }}
                >
                  السيرة الذاتية
                </Typography>

                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#0b1b34",
                    lineHeight: 1.8,
                    fontFamily: "Tajawal, sans-serif",
                    textAlign: "right",
                  }}
                >
                  {teacher.bio || "لا توجد سيرة ذاتية متاحة لهذا المعلم"}
                </Typography>
              </Card>

              <Card
                sx={{
                  ...sectionCardSx,
                  p: 3,
                  backgroundColor: "rgba(246, 250, 253, 0.6)",
                }}
              >
                <Stack
                  mt={2}
                  spacing={3}
                  sx={{ width: "100%", direction: "rtl", px: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CallRoundedIcon sx={{ color: "#243041" }} />

                    <Typography
                      sx={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#243041",
                        fontFamily: "Tajawal, sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      معلومات الاتصال
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <EmailRoundedIcon sx={{ color: "#243041", mt: 0.5 }} />

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#243041",
                          fontFamily: "Tajawal, sans-serif",
                          lineHeight: 1.2,
                        }}
                      >
                        البريد الإلكتروني
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "16px",
                          color: "#0b1b34",
                          fontFamily: "Tajawal, sans-serif",
                          wordBreak: "break-word",
                        }}
                      >
                        {teacher.email || "غير متوفر"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <PhoneIphoneRoundedIcon
                      sx={{ color: "#243041", mt: 0.5 }}
                    />

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#243041",
                          fontFamily: "Tajawal, sans-serif",
                          lineHeight: 1.2,
                        }}
                      >
                        الرقم
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "16px",
                          color: "#0b1b34",
                          fontFamily: "Tajawal, sans-serif",
                        }}
                      >
                        {teacher.phone || "غير متوفر"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
