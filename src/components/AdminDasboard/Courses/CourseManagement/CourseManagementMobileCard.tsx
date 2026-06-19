import React from "react";
import { Card, Typography, Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TCourse } from "../../../../types/cardType";

interface CourseManagementMobileCardProps {
  course: TCourse;
  onView: (course: TCourse) => void;
  onEdit: (course: TCourse) => void;
  onDelete: (course: TCourse) => void;
}

const CourseManagementMobileCard: React.FC<CourseManagementMobileCardProps> = ({
  course,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        borderRadius: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        },
      }}>
      <Typography fontWeight="bold">{course.title}</Typography>

      <Typography>
        <strong>التصنيف:</strong> {course.category}
      </Typography>

      <Typography>
        <strong>المتطلبات:</strong> {course.requirements}
      </Typography>

      <Typography>
        <strong>عدد الساعات:</strong> {course.duration}
      </Typography>

      <Typography>
        <strong>الوصف:</strong> {course.description}
      </Typography>

      <Stack direction="row" justifyContent="center" gap={2} mt={2}>
        <IconButton
          onClick={() => onView(course)}
          sx={{ background: "#e3f2fd" }}>
          <VisibilityIcon />
        </IconButton>

        <IconButton
          onClick={() => onEdit(course)}
          sx={{ background: "#e8f5e9" }}>
          <EditIcon />
        </IconButton>

        <IconButton
          onClick={() => onDelete(course)}
          sx={{ background: "#fdecea" }}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Card>
  );
};

export default React.memo(CourseManagementMobileCard);


