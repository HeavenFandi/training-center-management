import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Item } from "../../../types/dashboard";

interface CardProps {
  item: Item;
}

const Card: React.FC<CardProps> = ({ item }) => (
  <Paper
    sx={{
      p: 2,
      textAlign: "center",
      borderRadius: 5,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 4px 30px rgba(19, 62, 101, 0.06)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-5px)",
        backgroundColor: "rgba(255, 255, 255, 1)",
        boxShadow: "0 8px 40px rgba(19, 62, 101, 0.1)",
      }
    }}
  >
    <Box
      sx={{
        color: item.color,
        mb: 1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: "1.8rem" } })}
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={600}
      gutterBottom
      sx={{ fontSize: "0.9rem" }}
    >
      {item.title}
    </Typography>
    <Typography variant="h5" fontWeight={700} sx={{ color: "#1e293b" }}>
      {item.value}
    </Typography>
  </Paper>
);

export default memo(Card);


