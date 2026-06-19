import React from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,

  Avatar,
  ListItemText,
  Divider,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import { studentsData } from "../../../data/StudentData";
import { TCourse } from "../../../types/cardType";

interface RegisteredStudentsModalProps {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
}

const RegisteredStudentsModal: React.FC<RegisteredStudentsModalProps> = ({
  open,
  onClose,
  course,
}) => {
  if (!course) return null;

  const filteredStudents = studentsData.filter(
    (s) => studentsData.indexOf(s) < 3
  );

  const smallButtonStyle = {
    backgroundColor: "#133E65",
    color: "white",
    borderRadius: "50px",
    padding: { xs: "6px 16px", sm: "10px 28px" },
    fontWeight: "bold",
    fontSize: { xs: "0.75rem", sm: "1rem" },
    whiteSpace: "nowrap",
    boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
    "&:hover": { backgroundColor: "#0d2d4a" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
          p: 0,
          overflow: "hidden",
          direction: "rtl",
        },
      }}
    >
      <Box sx={{ display: "flex", minHeight: "500px" }}>
      <Box
          sx={{
            width: "35%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(19, 62, 101, 0.03)",
            borderLeft: "1px solid rgba(0,0,0,0.05)",
            p: 3,
          }}
        >
          <Typography
            fontWeight="bold"
            fontSize={20}
            color="#091c39"
            fontFamily="Tajawal"
            textAlign="center"
            mb={1}
          >
            {course.title}
          </Typography>

          <Stack spacing={1.5} width="100%" mt={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon sx={{ color: "#133E65", fontSize: 20 }} />
              <Typography fontSize={14} color="#555" fontFamily="Tajawal">
                المدرس: {course.instructor.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GroupIcon sx={{ color: "#133E65", fontSize: 20 }} />
              <Typography fontSize={14} color="#555" fontFamily="Tajawal">
                المسجلين: {filteredStudents.length} طالب
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            sx={{ borderBottom: "2px solid #133E65", pb: 1 }}
          >
            <Typography
              fontWeight="bold"
              fontSize={18}
              color="#133E65"
              fontFamily="Tajawal"
            >
              قائمة الطلاب المسجلين
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon sx={{ color: "#133E65" }} />
            </IconButton>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "400px", pr: 1 }}>
            <List sx={{ p: 0 }}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <React.Fragment key={student.id}>
                    <ListItem
                      alignItems="center"
                      sx={{
                        py: 1.5,
                        px: 0,
                        gap: 2,
                      }}
                    >
                    
                      <Avatar
                        alt={`${student.firstName} ${student.lastName}`}
                        src={student.image}
                        sx={{
                          width: 45,
                          height: 45,
                          border: "2px solid #e3f2fd",
                        }}
                      />

                      
                      <ListItemText
                        sx={{ textAlign: "right", flex: 1 }}
                        primary={
                          <Typography
                            fontWeight="bold"
                            sx={{ fontFamily: "Tajawal", color: "#1a2c4e" }}
                          >
                            {student.firstName} {student.lastName}
                          </Typography>
                        }
                      />

                      
                      <Chip
                        label="نشط"
                        size="small"
                        sx={{
                          color: "#10b981",
                          bgcolor: "rgba(16, 185, 129, 0.1)",
                          borderColor: "#10b981",
                          fontSize: 10,
                          height: 20,
                          fontFamily: "Tajawal",
                        }}
                      />
                    </ListItem>
                    {index < filteredStudents.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ opacity: 0.6 }} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <PersonIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                  <Typography color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
                    لا يوجد طلاب مسجلون حالياً
                  </Typography>
                </Box>
              )}
            </List>
          </Box>

          <Box mt={3} display="flex" >
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon sx={{ ml: 1 }} />}
              sx={smallButtonStyle}
              onClick={onClose}
            >
              إغلاق
            </Button>
          </Box>
        </Box>

     
     
      </Box>
    </Dialog>
  );
};

export default RegisteredStudentsModal;


