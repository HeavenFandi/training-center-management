import { Box, Typography, Stack, Paper, IconButton, Grid } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const days = [
  { name: "الأحد", date: 22 },
  { name: "الاثنين", date: 23 },
  { name: "الثلاثاء", date: 24 },
  { name: "الأربعاء", date: 25 },
  { name: "الخميس", date: 26 },
];

const lectures = [
  {
    title: "الرياضيات",
    startTime: "8:00 ",
    endTime: " 9:00",
    room: "القاعة 4",
  },
];

const Schedule = () => {
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
        sx={{ justifyContent: "space-between", mb: 3, alignItems: { xs: "stretch", md: "center" } }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ color: "#091c39", fontWeight: "bold", fontSize: { xs: 20, md: 24 }, mb: 0.5 }}>
            جدول الجلسات
          </Typography>
          <Typography color="#888" sx={{ fontSize: 13 }}>
            إدارة وتتبع مواعيد الجلسات لهذا الأسبوع
          </Typography>
        </Box>
    
        <Stack direction="row" spacing={1.5} gap={2} sx={{ overflowX: "auto", pb: 1 }}>
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
                12
              </Typography>
            </Box>
          </Paper>
          <Paper sx={{ ...cardStyle, p: 1.5, minWidth: { xs: 120, md: 130 } }}>
            <AccessTimeFilledIcon
              sx={{ color: "rgba(31, 175, 56, 1)", fontSize: "28px", ml: 1 }}
            />
            <Box>
              <Typography
                sx={{ color: "#64748b", fontWeight: "bold", fontSize: 12 }}>
                ساعات العمل
              </Typography>
              <Typography
                sx={{ color: "#091c39", fontWeight: "bold", fontSize: 15 }}>
                18
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
          <IconButton size="small" sx={{ color: "#091c39" }}>
            <ChevronLeftIcon />
          </IconButton>
          <CalendarTodayIcon sx={{ color: "green", fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>15 - 21 Dec, 2025</Typography>
          <IconButton size="small" sx={{ color: "#091c39" }}>
            <ChevronRightIcon />
          </IconButton>
        </Paper>
      </Box>
  
      <Grid container spacing={1.5} columns={5} sx={{ direction: "rtl", mb: 2 }}>
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
              }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  fontWeight={800}
                  sx={{ color: "#091c39", fontSize: 15, fontFamily: "Tajawal" }}>
                  {day.name}
                </Typography>
                <Typography color="#091c39" fontWeight={600} fontSize={15}>
                  {day.date}
                </Typography>
              </Box>
            </Paper>

            <Stack spacing={1.5}>
              {lectures.map((lec, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }
                  }}>
                  <Typography
                    fontWeight={900}
                    mb={1.5}
                    color="#091c39"
                    fontSize={16}
                    sx={{ fontFamily: "Tajawal" }}>
                    {lec.title}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AccessTimeFilledIcon
                      sx={{
                        fontSize: "18px",
                        color: "#64748b",
                        ml: 1,
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "rgba(74, 127, 167, 1)",
                          fontWeight: 800,
                        }}>
                        {lec.startTime} - {lec.endTime}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon
                      sx={{
                        fontSize: "18px",
                        color: "#64748b",
                        ml: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#888",
                        fontWeight: 700,
                        fontFamily: "Tajawal",
                      }}>
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
  }
};

export default Schedule;


