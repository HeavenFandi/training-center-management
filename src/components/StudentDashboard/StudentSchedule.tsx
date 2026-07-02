import React from "react";
import { Box, Typography, Paper, IconButton, Grid, Stack, Skeleton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Day, Lecture } from "../../types/studentDashboard";

interface StudentScheduleProps {
  days: Day[];
  lecturesData: Record<string, Lecture[]>;
  referenceDate?: Date;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  isEmpty?: boolean;
  loading?: boolean;
}

const StudentSchedule: React.FC<StudentScheduleProps> = ({
  days,
  lecturesData,
  referenceDate = new Date(),
  onPrevWeek,
  onNextWeek,
  isEmpty = false,
  loading = false,
}) => (
  <Box sx={{ mb: 8 }}>
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          color: "#091c39",
          mb: 1,
          fontFamily: "Tajawal",
        }}
      >
        الجدول الدراسي
      </Typography>
      <Typography variant="body2" sx={{ color: "#888", fontFamily: "Tajawal" }}>
        عرض جلسات الأسبوع الحالي
      </Typography>
    </Box>

    <Box
      sx={{
        borderRadius: "16px",
        mb: 4,
      }}
    >
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
        }}
      >
        <IconButton size="small" sx={{ color: "#091c39" }} onClick={onNextWeek}>
          <ChevronRightIcon />
        </IconButton>
        <CalendarTodayIcon sx={{ color: "green", fontSize: 20 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
          {(() => {
            const startOfWeek = new Date(referenceDate);
            startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            const formatDate = (date: Date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day} - ${endOfWeek.getDate()} ${month}, ${year}`;
            };
            
            return formatDate(startOfWeek);
          })()}
        </Typography>
        <IconButton size="small" sx={{ color: "#091c39" }} onClick={onPrevWeek}>
          <ChevronLeftIcon />
        </IconButton>
      </Paper>
    </Box>

    {loading ? (
      <Grid container spacing={1.5} columns={7} sx={{ direction: "rtl" }}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Grid size={{ xs: 7, sm: 3.5, md: 1 }} key={index}>
            <Paper
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                textAlign: "center",
                mb: 1.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width="45%" height={24} />
                <Skeleton variant="text" width="20%" height={24} />
              </Stack>
            </Paper>

            <Stack spacing={1.5}>
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <Paper
                  key={cardIndex}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                  }}
                >
                  <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1.5 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Paper>
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>
    ) : isEmpty ? (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography sx={{ fontFamily: "Tajawal" }}>لا يوجد جدول دراسي حالياً</Typography>
      </Box>
    ) : (
      <Grid container spacing={1.5} columns={7} sx={{ direction: "rtl" }}>
        {days.map((day) => (
          <Grid size={{xs:7,sm:3.5, md:1}} key={day.dateString}>
            <Paper
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                textAlign: "center",
                mb: 1.5,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontWeight={800}
                  sx={{
                    color: "#091c39",
                    fontSize: "15px",
                    fontFamily: "Tajawal",
                  }}
                >
                  {day.name}
                </Typography>
                <Typography color="#091c39" fontWeight={600} fontSize="15px">
                  {day.date}
                </Typography>
              </Stack>
            </Paper>

            <Stack spacing={1.5}>
              {(() => {
                console.log("[DEBUG StudentSchedule] Looking up lectures for day:", {
                  dayName: day.name,
                  dateString: (day as any).dateString,
                  availableKeys: Object.keys(lecturesData)
                });
                const lectures = lecturesData[(day as any).dateString] || lecturesData[day.name] || [];
                
                if (lectures.length === 0) {
                  // Render empty placeholder card
                  return (
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(10px)",
                        border: "1px dashed rgba(100, 116, 139, 0.3)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                        textAlign: "center",
                        minHeight: "160px", // Match typical card height
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "14px",
                          fontWeight: 600,
                          fontFamily: "Tajawal",
                        }}
                      >
                        لا يوجد محاضرات لهذا اليوم
                      </Typography>
                    </Paper>
                  );
                }
                
                // Render actual lecture cards
                return lectures.map((lec, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                    textAlign: "right",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      mb: 1.5,
                      color: "#091c39",
                      fontSize: "16px",
                      fontFamily: "Tajawal",
                    }}
                  >
                    {lec.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={1}
                  >
                    <AccessTimeFilledIcon
                      sx={{ fontSize: "18px", color: "#64748b", ml: 1 }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "rgba(74, 127, 167, 1)",
                          fontWeight: 800,
                        }}
                      >
                        {lec.startTime} - {lec.endTime}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={1}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 18,
                        height: 18,
                        bgcolor: "rgba(9, 28, 57, 0.05)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 1,
                        fontSize: "10px"
                      }}
                    >
                      👤
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#091c39",
                        fontWeight: 700,
                        fontFamily: "Tajawal",
                      }}
                    >
                      {lec.instructor}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <LocationOnIcon
                      sx={{ fontSize: "18px", color: "#64748b", ml: 1 }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#888",
                        fontWeight: 700,
                        fontFamily: "Tajawal",
                      }}
                    >
                      {lec.room}
                    </Typography>
                  </Stack>
                </Paper>
                ));
              })()}
            </Stack>
          </Grid>
        ))}
      </Grid>
    )}
  </Box>
);

export default StudentSchedule;


