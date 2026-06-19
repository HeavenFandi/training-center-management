import React from "react";
import { Stack, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CourseManagementPaginationProps {
  totalCourses: number;
}

const CourseManagementPagination: React.FC<CourseManagementPaginationProps> = ({
  totalCourses,
}) => {
  return (
    <Stack
      direction="row-reverse"
      justifyContent="space-between"
      alignItems="center"
      mt={3}>
      <Stack direction="row" spacing={3} gap={2}>
        <IconButton
          sx={{
            border: "2px solid black",
            borderRadius: "16px",
            color: "#091c39",
          }}>
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          sx={{
            border: "2px solid black",
            borderRadius: "16px",
            color: "#091c39",
          }}>
          <ChevronLeftIcon />
        </IconButton>
      </Stack>
      <Typography sx={{ color: "#091c39", fontWeight: "bold", fontSize: { xs: 16, sm: 22 } }}>
        عرض من {totalCourses} كورس
      </Typography>
    </Stack>
  );
};

export default React.memo(CourseManagementPagination);


