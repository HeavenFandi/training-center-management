import React from "react";
import { Paper, Box, Typography, Stack, LinearProgress } from "@mui/material";
import { ActiveCourse } from "../../types/studentDashboard";

const CourseActivityCard: React.FC<ActiveCourse> = (course) => {
  const total = Number(course.totalLectures) || 0;
  const attended = Number(course.lecturesAttended) || 0;
  const remaining = total - attended;
  const rawPercentage = Number(course.attendancePercentage) || 0;
  const percentage = rawPercentage > 1 ? rawPercentage : rawPercentage * 100;

  const statusText =
    total === 0
      ? "لم تبدأ المحاضرات بعد"
      : `${attended} درس مستمع . ${remaining} درس متبقي`;

  const displayPercentage = Math.min(Math.max(percentage, 0), 100);
  const fallbackImage =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='150'%20height='80'%3E%3Crect%20width='150'%20height='80'%20fill='%23f0f0f0'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%23888'%20font-family='Arial,%20sans-serif'%20font-size='12'%3ENo%20Image%3C/text%3E%3C/svg%3E";
  const imageSrc =
    typeof course.image === "string" && course.image.trim()
      ? course.image
      : fallbackImage;
  const courseTitle = course.courseName || "دورة نشطة";

  return (
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
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          order: { xs: 2, sm: 1 },
        }}
      >
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
          {courseTitle}
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
            {statusText} · {`${total} درس`}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ width: "100%", mt: 1 }}
          >
            <LinearProgress
              variant="determinate"
              value={displayPercentage}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 5,
                bgcolor: "#f0f0f0",
                transform: "rotate(180deg)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: displayPercentage > 60 ? "#4caf50" : "#f44336",
                  borderRadius: 5,
                },
              }}
            />
            <Typography
              sx={{
                fontWeight: 800,
                color: displayPercentage > 60 ? "#4caf50" : "#f44336",
                fontSize: "14px",
                textAlign: "right",
                minWidth: "40px",
              }}
            >
              {displayPercentage}%
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              display: "block",
              mt: 0.5,
              fontFamily: "Tajawal",
              textAlign: "right",
            }}
          >
            نسبة الإكمال الفعلية للدورة
          </Typography>
        </Box>
      </Box>
      <Box
        component="img"
        src={imageSrc}
        alt={courseTitle}
        onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
          event.currentTarget.src = fallbackImage;
        }}
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
};

export default CourseActivityCard;
