import React from "react";
import { Box, Typography, Dialog, Button, Stack, Avatar, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

import { Student } from "../../../types/studentDashboard";

interface Props {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

const StudentDetailsModal: React.FC<Props> = ({ open, onClose, student }) => {
  if (!student) return null;

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

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactElement<any>;
    label: string;
    value?: string;
  }) => (
    <Stack direction="row" spacing={1} alignItems="center" mb={1.5} gap={1}>
      {React.cloneElement(icon, { sx: { color: "#133E65", fontSize: 20 } })}
      <Typography
        fontSize={14}
        fontWeight="bold"
        color="#333"
        fontFamily="Tajawal"
      >
        {label}:
      </Typography>
      <Typography fontSize={14} color="#555" fontFamily="Tajawal">
        {value || "---"}
      </Typography>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          backgroundColor: "#F8FAFC",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
          p: 0,
          overflow: "hidden",
          direction: "rtl",
        },
      }}
    >
      <Box sx={{ display: "flex", minHeight: "400px" }}>

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
          <Avatar
            src={student.image}
            sx={{
              width: 160,
              height: 160,
              border: "6px solid white",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            }}
          />
          <Typography
            fontWeight="bold"
            fontSize={20}
            color="#091c39"
            fontFamily="Tajawal"
            mt={2}
            textAlign="center"
          >
            {student.firstName} {student.lastName}
          </Typography>
          <Typography fontSize={14} color="#8E8E8E" fontFamily="Tajawal">
            رقم الطالب: #{student.id}
          </Typography>
        </Box>

   
        <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            <Typography
              fontWeight="bold"
              fontSize={18}
              color="#133E65"
              fontFamily="Tajawal"
              mb={3}
              sx={{ borderBottom: "2px solid #133E65", width: "fit-content", pb: 0.5 }}
            >
              المعلومات الشخصية
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:12}}>
                <DetailItem icon={<PersonIcon />} label="اسم المستخدم" value={`@${student.username}`} />
              </Grid>
              <Grid size={{xs:12, sm:12}}>
                <DetailItem
                  icon={<SchoolIcon />}
                  label="السيرة الذاتية (Bio)"
                  value={student.bio || "لا يوجد سيرة ذاتية"}
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <DetailItem icon={<HomeIcon />} label="العنوان" value={student.address} />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <DetailItem icon={<PersonIcon />} label="الجنس" value={student.gender} />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <DetailItem icon={<CalendarMonthIcon />} label="تاريخ الميلاد" value={student.birthDate} />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <DetailItem icon={<CalendarMonthIcon />} label="تاريخ التسجيل" value={student.enrollmentDate} />
              </Grid>
            </Grid>
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          
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

export default StudentDetailsModal;


