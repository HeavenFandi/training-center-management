import React,{memo} from "react";
import { Paper, Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

type ScheduleItem = {
  id: number;
  time: string;
  title: string;
};

type Props = {
  data: ScheduleItem[];
};

const ScheduleCard: React.FC<Props> = ({ data }) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        direction: "ltr",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }
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

      
      {data.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(226, 234, 244, 0.4)",
            backdropFilter: "blur(5px)",
            px: 2,
            py: 1.2,
            borderRadius: "12px",
            mb: 1,
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
            {item.time}
          </Typography>

          <Typography variant="body2" sx={{ color: "#556" }}>
            {item.title}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default memo(ScheduleCard);

