import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import { TCourse } from "../../../../types/cardType";

interface CourseMainInfoProps {
  course: TCourse;
}

const CourseMainInfo: React.FC<CourseMainInfoProps> = ({ course }) => {
  return (
    <Box>
      <Typography
        fontWeight="bold"
        fontSize={22}
        mb={1}
        color="#091c39"
        fontFamily="Tajawal"
      >
        {course.title}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" mb={1} gap={1}>
        <Chip
          icon={<CategoryIcon sx={{ fontSize: "16px !important", color: "#133E65 !important" }} />}
          label={course.category}
          size="small"
          sx={{
            fontFamily: "Tajawal",
            bgcolor: "#E3F2FD",
            color: "#133E65",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PersonIcon sx={{ fontSize: 18, color: "#666" }} />
          <Typography fontSize={13} color="#555" fontFamily="Tajawal">
            المدرس: {course.instructor.name}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        <GroupIcon sx={{ fontSize: 18, color: "#666" }} />
        <Typography fontSize={13} color="#666" fontFamily="Tajawal">
          عدد الطلاب: {course.students} طالب
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(CourseMainInfo);


