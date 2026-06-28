import React, { memo } from "react";
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { LectureResponse, TimeObject } from "../../../api/trainingSessionApi";

const formatTime = (time: TimeObject | string | undefined | null): string => {
  if (!time) return "00:00";
  
  if (typeof time === "string") {
    // If it's already a string like "HH:mm:ss" or "HH:mm"
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return time;
  }
  
  // If it's a TimeObject
  const hour = String(time.hour ?? 0).padStart(2, "0");
  const minute = String(time.minute ?? 0).padStart(2, "0");
  return `${hour}:${minute}`;
};

type Props = {
  data: LectureResponse[];
  loading?: boolean;
  error?: string | null;
};

const ScheduleCard: React.FC<Props> = ({ data, loading, error }) => {
  return (
    <Paper
      sx={{
        p: 1.5,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        direction: "ltr",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          جدول قاعات اليوم
        </Typography>
        <CalendarMonth sx={{ fontSize: 18, color: "#1a2c4e" }} />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {!loading && !error && data.length === 0 && (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#666",
            py: 2,
          }}
        >
          لا توجد محاضرات مجدولة اليوم
        </Typography>
      )}

      {!loading && !error && data.length > 0 && (
        data.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(226, 234, 244, 0.4)",
              backdropFilter: "blur(5px)",
              px: 2,
              py: 0.6,
              borderRadius: "12px",
              mb: 0.8,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              sx={{
                bgcolor: "rgba(255,255,255,0.5)",
                px: 2,
                py: 0.5,
                borderRadius: 10,
                color: "#5887ad",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Typography>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" sx={{ color: "#556" }}>
                {item.sessionName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#888",
                  fontSize: "0.7rem",
                }}
              >
                {item.classroomNumber}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default memo(ScheduleCard);

