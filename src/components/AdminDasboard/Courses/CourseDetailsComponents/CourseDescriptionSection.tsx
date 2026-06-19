import React from "react";
import { Box, Typography } from "@mui/material";
import { TCourse } from "../../../../types/cardType";

interface CourseDescriptionSectionProps {
  course: TCourse;
}

const CourseDescriptionSection: React.FC<CourseDescriptionSectionProps> = ({ course }) => {
  return (
    <Box>
      <Typography fontWeight="bold" fontSize={13} mb={0.5} color="#333" fontFamily="Tajawal">
        وصف الكورس
      </Typography>
      <Typography
        fontSize={11}
        color="#555"
        mb={2.5}
        sx={{ lineHeight: 1.6, fontFamily: "Tajawal" }}
      >
        {course.description}
      </Typography>

      <Typography fontWeight="bold" fontSize={13} mb={0.5} color="#333" fontFamily="Tajawal">
        (متطلبات الكورس / المدرب)
      </Typography>
      <Typography
        fontSize={11}
        color="#555"
        mb={2.5}
        sx={{ lineHeight: 1.6, fontFamily: "Tajawal" }}
      >
        {course.requirements}
      </Typography>
    </Box>
  );
};

export default React.memo(CourseDescriptionSection);


