import React from "react";
import { Box, Stack, Button } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CourseActionButtonsProps {
  onOpenStudents: () => void;
  onOpenAddSession: () => void;
  onOpenEdit: () => void;
  onClose: () => void;
}

const CourseActionButtons: React.FC<CourseActionButtonsProps> = ({
  onOpenStudents,
  onOpenAddSession,
  onOpenEdit,
  onClose,
}) => {
  const smallButtonStyle = {
    bgcolor: "#EFF6F7",
    color: "#5C5C5C",
    borderRadius: "10px",
    px: 2,
    py: 0.5,
    fontSize: "12px",
    boxShadow: "none",
    textTransform: "none",
    border: "1px solid #D9EAEB",
    minWidth: "auto",
    fontFamily: "Tajawal",
    "&:hover": { bgcolor: "#dbebef" },
  };

  return (
    <Box mt={3}>
      <Stack
        direction="row"
        spacing={1.5}
        mb={1.5}
        justifyContent="flex-start"
        gap={2}
      >
        <Button
          variant="contained"
          onClick={onOpenStudents}
          startIcon={<GroupIcon sx={{ fontSize: "18px !important", ml: 3 }} />}
          sx={{
            bgcolor: "#091c39",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "12px",
            px: 2.5,
            py: 0.8,
            boxShadow: "none",
            textTransform: "none",
            border: "1px solid #D9EAEB",
            fontFamily: "Tajawal",
          }}
        >
          عرض الطلاب المسجلين
        </Button>

        <Button
          variant="contained"
          onClick={onOpenAddSession}
          startIcon={<AddCircleOutlineIcon sx={{ fontSize: "18px !important", ml: 3 }} />}
          sx={{
            bgcolor: "#091c39",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "12px",
            px: 2.5,
            py: 0.8,
            boxShadow: "none",
            textTransform: "none",
            border: "1px solid #D9EAEB",
            fontFamily: "Tajawal",
          }}
        >
          إضافة جلسة
        </Button>

        <Button
          variant="contained"
          onClick={onOpenEdit}
          startIcon={<EditIcon sx={{ fontSize: "18px !important", ml: 3 }} />}
          sx={{
            bgcolor: "#091c39",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "12px",
            px: 2.5,
            py: 0.8,
            boxShadow: "none",
            textTransform: "none",
            border: "1px solid #D9EAEB",
            fontFamily: "Tajawal",
          }}
        >
          تعديل معلومات الكورس
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-start" gap={2}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important", ml: 3 }} />}
          sx={smallButtonStyle}
          onClick={onClose}
        >
          عودة
        </Button>
      </Stack>
    </Box>
  );
};

export default React.memo(CourseActionButtons);


