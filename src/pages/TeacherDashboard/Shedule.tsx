import { Box, Typography, Stack, Paper, IconButton, Grid } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetTeacherWeeklySchedule from "../../store/teachers/act/actGetTeacherWeeklySchedule";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const dispatch = useAppDispatch();

  const weeklySchedule = useAppSelector(
    (state) => state.teachers.weeklySchedule,
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.teacherId) {
      dispatch(
        actGetTeacherWeeklySchedule({
          teacherId: user.teacherId,
          date: selectedDate,
        }),
      );
    }
  }, [dispatch, selectedDate]);
  // dayNameArabic is a mapping of English day names to their Arabic equivalents.
  const dayNameArabic: Record<string, string> = {
    SUNDAY: "الأحد",
    MONDAY: "الاثنين",
    TUESDAY: "الثلاثاء",
    WEDNESDAY: "الأربعاء",
    THURSDAY: "الخميس",
    FRIDAY: "الجمعة",
    SATURDAY: "السبت",
  };
  // group the weeklySchedule by lectureDate
  const groupedSchedule = weeklySchedule.reduce(
    (acc, item) => {
      const key = item.lectureDate;

      if (!acc[key]) {
        acc[key] = {
          day: item.day,
          lectureDate: item.lectureDate,
          lectures: [],
        };
      }

      acc[key].lectures.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        day: string;
        lectureDate: string;
        lectures: typeof weeklySchedule;
      }
    >,
  );
  const changeWeek = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };
  const scheduleDays = Object.values(groupedSchedule);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 2.5 },

        display: "flex",
        flexDirection: "column",
      }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          mb: 3,
          alignItems: { xs: "stretch", md: "center" },
        }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "#091c39",
              fontWeight: "bold",
              fontSize: { xs: 20, md: 24 },
              mb: 0.5,
            }}>
            جدول الجلسات
          </Typography>
          <Typography color="#888" sx={{ fontSize: 13 }}>
            إدارة وتتبع مواعيد الجلسات لهذا الأسبوع
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          gap={2}
          sx={{ overflowX: "auto", pb: 1 }}>
          <Paper sx={{ ...cardStyle, p: 1.5, minWidth: { xs: 120, md: 130 } }}>
            <SchoolOutlinedIcon
              sx={{ fontSize: "28px", color: "rgba(74, 127, 167, 1)", ml: 1 }}
            />
            <Box>
              <Typography
                sx={{ color: "#64748b", fontWeight: "bold", fontSize: 12 }}>
                إجمالي الحصص
              </Typography>
              <Typography
                sx={{ color: "#091c39", fontWeight: "bold", fontSize: 15 }}>
                {weeklySchedule.length}
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Stack>

      <Box
        sx={{
          width: "100%",
          borderRadius: "16px",
          mb: 2.5,
        }}>
        <Paper
          sx={{
            p: 1.2,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
          }}>
          <IconButton
            onClick={() => changeWeek(7)}
            size="small"
            sx={{ color: "#091c39" }}>
            <ChevronLeftIcon />
          </IconButton>
          <CalendarTodayIcon sx={{ color: "green", fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {scheduleDays.length > 0
              ? `${scheduleDays[0].lectureDate} - ${
                  scheduleDays[scheduleDays.length - 1].lectureDate
                }`
              : "لا توجد جلسات"}
          </Typography>
          <IconButton
            onClick={() => changeWeek(-7)}
            size="small"
            sx={{ color: "#091c39" }}>
            <ChevronRightIcon />
          </IconButton>
        </Paper>
      </Box>

      {scheduleDays.length > 0 ? (
        <Grid
          container
          spacing={1.5}
          columns={5}
          sx={{ direction: "rtl", mb: 2 }}>
          {scheduleDays.map((day, index) => (
            <Grid
              size={{ xs: 5, sm: 2.5, md: 1 }}
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}>
              <Paper
                sx={{
                  px: 2,
                  py: 0.8,
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(31,38,135,0.07)",
                  textAlign: "center",
                  mb: 1.5,
                }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <Typography
                    fontWeight={800}
                    sx={{ color: "#091c39", fontSize: 15 }}>
                    {dayNameArabic[day.day] || day.day}
                  </Typography>

                  <Typography color="#091c39" fontWeight={600} fontSize={15}>
                    {day.lectureDate}
                  </Typography>
                </Box>
              </Paper>

              <Stack spacing={1.5} sx={{ flex: 1 }}>
                {day.lectures.map((item, idx) => (
                  <Paper
                    key={idx}
                    sx={{
                      p: 2,
                      minHeight: 150,
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 8px 32px rgba(31,38,135,0.07)",
                    }}>
                    <Typography
                      fontWeight={900}
                      color="#091c39"
                      fontSize={16}
                      mb={1.5}
                      sx={{ fontFamily: "Tajawal" }}>
                      {item.courseName}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={1}>
                      <AccessTimeFilledIcon
                        sx={{
                          fontSize: 18,
                          color: "#64748b",
                          ml: 1,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#4A7FA7",
                          fontWeight: 800,
                        }}>
                        {item.startTime} - {item.endTime}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon
                        sx={{
                          fontSize: 18,
                          color: "#64748b",
                          ml: 1,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#888",
                          fontWeight: 700,
                          fontFamily: "Tajawal",
                        }}>
                        {item.room}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            p: 5,
            borderRadius: "18px",
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 8px 32px rgba(31,38,135,0.07)",
          }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#64748b",
            }}>
            لا توجد جلسات لهذا الأسبوع
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

const cardStyle = {
  p: 1.5,
  borderRadius: "16px",
  minWidth: 130,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
};

export default Schedule;
