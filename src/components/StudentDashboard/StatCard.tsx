import React from "react";
import { Paper, Box, Typography } from "@mui/material";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      boxShadow: "0 10px 40px rgba(19, 62, 101, 0.08)",
      textAlign: "center",
      minWidth: "150px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-8px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 15px 50px rgba(19, 62, 101, 0.12)",
      }
    }}
  >
    <Box
      sx={{
        bgcolor: `${color}15`,
        p: 1,
        borderRadius: "12px",
        mb: 1.5,
        color: color,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="caption"
      sx={{
        color: "#64748b",
        fontWeight: "bold",
        mb: 0.5,
        fontFamily: "Tajawal",
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h6"
      sx={{ color: "#091c39", fontWeight: "bold", fontFamily: "Tajawal" }}
    >
      {value}
    </Typography>
  </Paper>
);

export default StatCard;


