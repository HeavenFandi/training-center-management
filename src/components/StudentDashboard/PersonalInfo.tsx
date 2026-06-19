import React from "react";
import { Paper, Box, Typography, Stack } from "@mui/material";
import { Student } from "../../types/studentDashboard";

interface PersonalInfoProps {
  student: Student;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ student }) => {
  console.log("[DEBUG PersonalInfo] Received student:", student);
  console.log("[DEBUG PersonalInfo] student.bio:", student.bio);
  
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
    <Typography
      variant="h6"
      sx={{
        fontWeight: 900,
        color: "#091c39",
        mb: 3,
        textAlign: "right",
        fontFamily: "Tajawal",
      }}
    >
      المعلومات الشخصية
    </Typography>
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
