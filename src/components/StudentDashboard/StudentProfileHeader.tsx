import React from "react";
import { Stack, Button, Avatar, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Student } from "../../types/studentDashboard";

interface StudentProfileHeaderProps {
  student: Student;
  onEdit: () => void;
}

const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  student,
  onEdit,
}) => (
  <Stack
    direction={{ xs: "column-reverse", sm: "row-reverse" }}
    justifyContent="space-between"
    alignItems={{ xs: "center", sm: "flex-start" }}
    spacing={{ xs: 2, sm: 0 }}
    mb={4}
  >
    <Button
      variant="contained"
      startIcon={<EditIcon sx={{ ml: { xs: 1, sm: 3 } }} />}
      onClick={onEdit}
      fullWidth={false}
      sx={{
        bgcolor: "#4caf50",
        "&:hover": { bgcolor: "#43a047" },
        borderRadius: "10px",
        fontWeight: "bold",
        px: { xs: 2, sm: 2 },
        py: { xs: 1, sm: 1 },
        fontFamily: "Tajawal",
        fontSize: { xs: "0.8rem", sm: "1rem" },
    
      }}
    >
      تعديل البيانات
    </Button>

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
      <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
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


