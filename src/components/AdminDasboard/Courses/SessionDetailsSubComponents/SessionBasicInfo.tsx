import React from "react";
import { Box, Typography, Stack, Chip, Grid, Card, CardContent } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import InfoIcon from "@mui/icons-material/Info";
import { TCourse, TSession } from "../../../../types/cardType";

interface SessionBasicInfoProps {
  session: TSession;
  course: TCourse;
  lecturesCount: number;
}

const SessionBasicInfo: React.FC<SessionBasicInfoProps> = ({ session, course, lecturesCount }) => {
  // Helper function to extract days from duration string (e.g., "70 days for 20 lectures" → "70")
  const extractDays = (duration: string | undefined) => {
    if (!duration) return "0";
    const numbers = duration.match(/\d+/g);
    return numbers && numbers.length > 0 ? numbers[0] : duration;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشطة":
        return "primary";
      case "مكتملة":
        return "default";
      case "قيد الانتظار":
        return "warning";
      default:
        return "default";
    }
  };

  const formatValue = (value: any) => {
    return value || value === 0 ? value : "-";
  };

  return (


    <Stack spacing={3} sx={{margin:"10px"}}>

     
          <Stack direction={{ xs: "column", sm: "row"}} sx={{gap:"10px"}}  alignItems="flex-start">
            {session.image && (
              <Box 
                sx={{ 
                  width: { xs: "100%", sm: "200px" }, 
                  height: "160px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  flexShrink: 0
                }}
              >
                <img 
                  src={session.image} 
                  alt={session.title} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover"
                  }} 
                />
              </Box>
            )}
            <Box >
              <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
                <Typography variant="h4" fontWeight="700" sx={{ fontFamily: "Tajawal", color: "#0f172a" }}>
                  {session.title}
                </Typography>
                <Chip 
                  label={session.status} 
                  color={getStatusColor(session.status)}
                  sx={{ fontWeight: "600", fontFamily: "Tajawal" }}
                />
              </Stack>
              <Typography variant="body1" color="#64748b" sx={{ fontFamily: "Tajawal", mb: 2 }}>
                {course.title || course.name || "-"}
              </Typography>
            </Box>
          </Stack>



  <Grid container spacing={3} rowSpacing={3}  >
 
  <Grid size={{ xs: 12, sm: 6 }} >

    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:"10px"}}>

      <CalendarTodayIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          التاريخ:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{ fontFamily: "Tajawal", color: "#0f172a" }}
        >
          {formatValue(session.startDate)}
        </Typography>
      </Box>
    </Stack>
  </Grid>


    <Grid size={{ xs: 12, sm: 6 }}>

    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:"10px"}}>

      <AccessTimeIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          الوقت والمدة:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{
            fontFamily: "Tajawal",
            color: "#0f172a",
            display: "flex",
            gap: "4px",
            direction: "rtl",
          }}
        >
          <span>{formatValue(extractDays(session.duration))} يوماً</span>
          <span style={{ color: "#64748b", fontWeight: 400 }}>
            ({formatValue(lecturesCount)} محاضرة)
          </span>
        </Typography>
      </Box>
    </Stack>
  </Grid>

   <Grid size={{ xs: 12, sm: 6 }}>

    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:"10px"}}>

      <PersonIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          المدرس:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{ fontFamily: "Tajawal", color: "#0f172a" }}
        >
          {formatValue(session.teacherName || course.instructor?.name)}
        </Typography>
      </Box>
    </Stack>
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>

    <Stack direction="row" spacing={2} alignItems="center"sx={{gap:"10px"}}>

      <MeetingRoomIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          القاعة:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{ fontFamily: "Tajawal", color: "#0f172a" }}
        >
          {formatValue(session.hall)}
        </Typography>
      </Box>
    </Stack>
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>

    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:"10px"}}>

      <AttachMoneyIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          السعر:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{ fontFamily: "Tajawal", color: "#133e65" }}
        >
          {session.price === 0
            ? "مجاني"
            : `${formatValue(session.price)} ل.س`}
        </Typography>
      </Box>
    </Stack>
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>
    <Stack direction="row" spacing={2} alignItems="center" sx={{gap:"10px"}}>
      <EventSeatIcon sx={{ fontSize: 20, color: "#133e65" }} />
      <Box>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Tajawal", color: "#64748b", mb: 0.2 }}
        >
          المقاعد المتاحة:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{ fontFamily: "Tajawal", color: "#0f172a" }}
        >
          {formatValue(session.availableSeats)} مقعد (الحد الأدنى:{" "}
          {formatValue(session.minCapacity)})
        </Typography>
      </Box>
    </Stack>
  </Grid>

 
  {session.requiredEquipment && (
    <Grid size={{ xs: 12}}>
      <Box
        sx={{
          p: 2,
          bgcolor: "#f8fafc",
          borderRadius: "8px",
          border: "1px dashed #e2e8f0",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <InfoIcon
            sx={{ fontSize: 18, color: "#64748b", mt: 0.3 }}
          />
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Tajawal",
                display: "block",
                mb: 0.5,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              التجهيزات المطلوبة:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Tajawal",
                color: "#334155",
                lineHeight: 1.6,
              }}
            >
              {formatValue(session.requiredEquipment)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Grid>
  )}
</Grid>
    </Stack>
  );
};

export default React.memo(SessionBasicInfo);