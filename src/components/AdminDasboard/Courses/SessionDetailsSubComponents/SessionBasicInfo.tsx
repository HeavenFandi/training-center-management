import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { TCourse, TSession } from "../../../../types/cardType";

interface SessionBasicInfoProps {
  session: TSession;
  course: TCourse;
}

const SessionBasicInfo: React.FC<SessionBasicInfoProps> = ({ session, course }) => {
  return (
    <Box 
      sx={{ 
        mb: 3, 
        p: 0, 
        bgcolor: "#fff", 
        borderRadius: "20px", 
        overflow: "hidden",
        border: "1px solid rgba(19, 62, 101, 0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="stretch">
        <Box sx={{ p: 3, flex: 1 }}>
          <Typography variant="subtitle2" color="#133E65" gutterBottom sx={{ fontFamily: "Tajawal", fontWeight: "900", mb: 2, fontSize: "1rem" }}>
            معلومات أساسية
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(19, 62, 101, 0.05)", p: 0.8, borderRadius: "8px", display: "flex" }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "#133E65" }} />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: "#475569", fontWeight: "500" }}>
                التاريخ: <strong>{session.startDate}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(19, 62, 101, 0.05)", p: 0.8, borderRadius: "8px", display: "flex" }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "#133E65" }} />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: "#475569", fontWeight: "500" }}>
                الوقت والمدة: <strong>{session.startTime} {session.duration && `(${session.duration})`}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(19, 62, 101, 0.05)", p: 0.8, borderRadius: "8px", display: "flex" }}>
                <PersonIcon sx={{ fontSize: 18, color: "#133E65" }} />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: "#475569", fontWeight: "500" }}>
                المدرس: <strong>{course.instructor.name}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ bgcolor: "rgba(19, 62, 101, 0.05)", p: 0.8, borderRadius: "8px", display: "flex" }}>
                <MeetingRoomIcon sx={{ fontSize: 18, color: "#133E65" }} />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: "#475569", fontWeight: "500" }}>
                القاعة: <strong>{session.hall}</strong>
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {session.image && (
          <Box 
            sx={{ 
              width: { xs: "100%", sm: "220px" }, 
              minHeight: "180px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <img 
              src={session.image} 
              alt={session.title} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: "block"
              }} 
            />
            
            <Box 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                background: "linear-gradient(to right, rgba(255,255,255,0.1), transparent)" 
              }} 
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default React.memo(SessionBasicInfo);


