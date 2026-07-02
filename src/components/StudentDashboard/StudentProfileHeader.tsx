import React from "react";
import { Stack, Avatar, Box, Typography } from "@mui/material";
import { Student } from "../../types/studentDashboard";

interface StudentProfileHeaderProps {
  student: Student;
}

const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  student,
}) => (
  <Stack
    direction="row"
    justifyContent="flex"
    alignItems="flex-start"
    mb={4}
  >
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      gap={2}
    >
      <Avatar
        src={student.image}
        sx={{
          width: { xs: 64, sm: 80 },
          height: { xs: 64, sm: 80 },
          border: "4px solid #fff",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      />
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: "#091c39",
            fontFamily: "Tajawal",
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
          }}
        >
          {student.firstName} {student.lastName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            fontWeight: "bold",
            fontFamily: "Tajawal",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          @{student.username}
        </Typography>
      </Box>
    </Stack>
  </Stack>
);

export default StudentProfileHeader;


