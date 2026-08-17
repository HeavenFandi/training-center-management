import React from "react";
import { Paper, Box, Typography, Stack, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Student } from "../../types/studentDashboard";

interface PersonalInfoProps {
  student: Student;
  onEdit: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ student, onEdit }) => {
  return (
  <Paper
    sx={{
      p: 3,
      borderRadius: "24px",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      textAlign: "right",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          color: "#091c39",
          fontFamily: "Tajawal",
        }}
      >
        المعلومات الشخصية
      </Typography>
      <Button
        variant="text"
        startIcon={<EditIcon sx={{ ml: 1 }} />}
        onClick={onEdit}
        sx={{
          color: "#133E65",
          fontWeight: "bold",
          px: 2,
          py: 1,
          fontFamily: "Tajawal",
          fontSize: "0.9rem",
          textTransform: "none",
          borderRadius: "10px",
          bgcolor: "transparent",
          "&:hover": {
            bgcolor: "rgba(19, 62, 101, 0.08)",
          },
        }}
      >
       
      </Button>
    </Box>
    <Stack spacing={2.5}>
      {[
        { label: "البريد الإلكتروني", value: student.email },
        { label: "رقم الاتصال", value: student.contactInfo },
        { label: "الجنس", value: student.gender },
        { label: "تاريخ الميلاد", value: student.birthDate },
        { label: "العنوان", value: student.address },
        { label: "السيرة الذاتية (Bio)", value: student.bio },
        { label: "تاريخ التسجيل", value: student.enrollmentDate },
      ].map((item, idx) => (
        <Box key={idx} sx={{ textAlign: "right" }}>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              fontWeight: "bold",
              display: "block",
              mb: 0.5,
              fontFamily: "Tajawal",
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              color: "#091c39",
              fontSize: "14px",
              fontFamily: "Tajawal",
            }}
          >
            {item.value || "---"}
          </Typography>
          {idx < 6 && <Box sx={{ borderBottom: "1px solid #eee", mt: 1.5 }} />}
        </Box>
      ))}
    </Stack>
  </Paper>
  );
};

export default PersonalInfo;
