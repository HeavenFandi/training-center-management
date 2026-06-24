import React from "react";
import { Box, Typography, Dialog, Button, Stack, Avatar, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkIcon from "@mui/icons-material/Work";
import { TeacherApiResponse } from "../../../api/teacherApi";

interface Props {
  open: boolean;
  onClose: () => void;
  teacher: TeacherApiResponse | null;
  loading?: any;
  hasData?: boolean;
}

const TeacherDetailsModal: React.FC<Props> = ({ open, onClose, teacher }) => {
  if (!teacher) return null;

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
    value?: string | number;
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
            src={teacher.image}
            sx={{
              width: 160,
              height: 160,
              border: "6px solid white",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            }}
          >
            {teacher.firstName ? teacher.firstName.charAt(0) : ""}
          </Avatar>
          <Typography
            fontWeight="bold"
            fontSize={20}
            color="#091c39"
            fontFamily="Tajawal"
            mt={2}
            textAlign="center"
          >
            {teacher.firstName} {teacher.lastName}
          </Typography>
          <Typography fontSize={14} color="#8E8E8E" fontFamily="Tajawal">
            رقم المعلم: #{teacher.id}
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
              <Grid size={{ xs: 12, sm: 12 }}>
                <DetailItem icon={<PersonIcon />} label="اسم المستخدم" value={`@${teacher.username}`} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <DetailItem icon={<SchoolIcon />} label="السيرة الذاتية (CV)" value={teacher.cv} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<HomeIcon />} label="العنوان" value={teacher.address} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<WorkspacePremiumIcon />} label="التخصص" value={teacher.specialization} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<WorkIcon />} label="سنوات الخبرة" value={teacher.experienceYears} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<WorkspacePremiumIcon />} label="الشهادات" value={teacher.certificates} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<EmailIcon />} label="البريد الإلكتروني" value={teacher.email} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem icon={<PhoneIcon />} label="معلومات الاتصال" value={teacher.contactInfo} />
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

export default TeacherDetailsModal;
