import React from "react";
import { Box, Stack, Typography, Button, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface StudentManagementHeaderProps {
  onAddClick: () => void;
}

const StudentManagementHeader: React.FC<StudentManagementHeaderProps> = ({ onAddClick }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      spacing={2}
      mb={4}
      p={{ xs: 1, sm: 0 }}
      dir="rtl"
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <IconButton
            sx={{
              backgroundColor: "#091c39",
              color: "white",
              "&:hover": { backgroundColor: "#0d2d4a" },
              width: 28,
              height: 28,
            }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#091c39"
            sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
          >
            إدارة الطلاب
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 13, sm: 14 } }}>
          لوحة التحكم المركزية لإدارة شؤون الطلاب
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={onAddClick}
        sx={{
          backgroundColor: "#091c39",
          color: "white",
          borderRadius: "50px",
          px: { xs: 2, sm: 4 },
          py: 1.2,
          fontWeight: "bold",
          fontSize: "15px",
          whiteSpace: "nowrap",
          boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
          "&:hover": { backgroundColor: "#0d2d4a" },
        }}
      >
        إضافة طالب جديد
      </Button>
    </Stack>
  );
};

export default React.memo(StudentManagementHeader);


