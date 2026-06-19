import React from "react";
import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CourseManagementHeaderProps {
  onAddClick: () => void;
}

const CourseManagementHeader: React.FC<CourseManagementHeaderProps> = ({ onAddClick }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        mb: 4,
        p: { xs: 1, sm: 0 },
      }}
      dir="rtl">
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
            sx={{
              color: "#091c39",
              fontWeight: "bold",
              fontSize: { xs: 24, sm: 30 },
              fontFamily: "Tajawal",
            }}>
            إدارة الكورسات
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ 
            fontFamily: "Tajawal",
            fontSize: { xs: 14, sm: 16 }
          }}>
          أهلا بك في لوحة تحكم إدارة الكورسات المركزية
        </Typography>
      </Box>
      <Button
        onClick={onAddClick}
        variant="contained"
        sx={{
          backgroundColor: "#091c39",
          color: "white",
          borderRadius: "50px",
          px: { xs: 2, sm: 4 },
          py: 1.2,
          fontWeight: "bold",
          fontSize: "15px",
          boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
          fontFamily: "Tajawal",
          "&:hover": { backgroundColor: "#0d2d4a" },
        }}>
        إضافة كورس جديد
      </Button>
    </Stack>
  );
};

export default React.memo(CourseManagementHeader);


