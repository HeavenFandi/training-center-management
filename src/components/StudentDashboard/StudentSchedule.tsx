import React from "react";
import { Box, Typography, Paper, IconButton, Grid, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Day, Lecture } from "../../types/studentDashboard";

interface StudentScheduleProps {
  days: Day[];
  lecturesData: Record<string, Lecture[]>;
}

const StudentSchedule: React.FC<StudentScheduleProps> = ({
  days,
  lecturesData,
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
        <IconButton size="small" sx={{ color: "#091c39" }}>
          <ChevronRightIcon />
        </IconButton>
        <CalendarTodayIcon sx={{ color: "green", fontSize: 20 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
          {(() => {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
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
        <IconButton size="small" sx={{ color: "#091c39" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Paper>
    </Box>

    <Grid container spacing={1.5} columns={5} sx={{ direction: "rtl" }}>
      {days.map((day) => (
        <Grid size={{xs:5,sm:2.5, md:1}} key={day.date}>
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
            {(lecturesData[day.name] || []).map((lec, index) => (
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
            ))}
          </Stack>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default StudentSchedule;


