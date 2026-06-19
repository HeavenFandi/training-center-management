import React from "react";
import { Paper, Box, Typography, Stack, LinearProgress } from "@mui/material";
import { ActiveCourse } from "../../types/studentDashboard";

const CourseActivityCard: React.FC<ActiveCourse> = ({
  title,
  lessons,
  hoursLeft,
  progress,
  image,
}) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: "20px",
      mb: 2,
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" },
      gap: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        transform: { xs: "none", sm: "translateX(-5px)" },
      }
    }}
  >
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", order: { xs: 2, sm: 1 } }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: "16px",
          color: "#091c39",
          fontFamily: "Tajawal",
          textAlign: "right",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#888",
            display: "block",
            mb: 1,
            fontFamily: "Tajawal",
            textAlign: "right",
          }}
        >
          {lessons} درس . {hoursLeft} ساعات متبقية
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ width: "100%", mt: 1 }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 5,
              bgcolor: "#f0f0f0",
              transform: "rotate(180deg)",
              "& .MuiLinearProgress-bar": {
                bgcolor: progress > 60 ? "#4caf50" : "#f44336",
                borderRadius: 5,
              },
            }}
          />
          <Typography
            sx={{
              fontWeight: 800,
              color: progress > 60 ? "#4caf50" : "#f44336",
              fontSize: "14px",
              textAlign: "right",
              minWidth: "40px",
            }}
          >
            {progress}%
          </Typography>
        </Stack>
      </Box>
    </Box>
    <Box
      component="img"
      src={image}
      sx={{
        width: { xs: "100%", sm: 80 },
        height: { xs: 150, sm: 80 },
        borderRadius: "14px",
        objectFit: "cover",
        order: { xs: 1, sm: 2 },
      }}
    />
  </Paper>
);

export default CourseActivityCard;


