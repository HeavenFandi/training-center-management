import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TeacherProfileTopSections } from "./TeacherProfile/TeacherProfileTopSection";
import { TeacherProfileBottomSections } from "./TeacherProfile/TeacherProfileBottomSection";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditInformationTeacher, {
  TeacherFormData,
} from "../../components/AdminDasboard/Teachers/PersonalInfo/EditInformationTeacher";
import { useState } from "react";
export const teacher = {
  fname: " أحمد ",
  lname: "علي ",
  specialty: "مدرب تسويق رقمي",
  teacherCode: "T-2041",
  status: "نشط",
  city: "دمشق",
  experience: "+10",
  students: 200,
  coursesCount: 10,
  username: "ahmed_ali",
  email: "ahmad@gmail.com",
  phone: "0987354546",
  bio: "خبير في مجال التسويق الرقمي مع خبرة تزيد عن 10 سنوات في إدارة الحملات الإعلانية، وبناء الخطط التسويقية، وتطوير الاستراتيجيات الرقمية وتحليل الأداء وتحسين نتائج الحملات.",
  image:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  courses: [
    {
      id: 1,
      title: "التسويق الإلكتروني",
      hours: "30 ساعة",
      students: 45,
    },
    {
      id: 2,
      title: "إدارة الحملات الإعلانية",
      hours: "24 ساعة",
      students: 32,
    },
    {
      id: 3,
      title: "تحليل الأداء الرقمي",
      hours: "18 ساعة",
      students: 27,
    },
  ],
};

export const sectionSx = {
  borderRadius: "22px",
  p: { xs: 2, md: 3 },
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  border: "1px solid #e9eef5",
  backgroundColor: "#fff",
};

export const chipSx = {
  borderRadius: "10px",
  backgroundColor: "#f1f5f9",
  color: "#334155",
  fontWeight: 700,
  fontFamily: "Tajawal, sans-serif",
};

export const miniChipSx = {
  borderRadius: "10px",
  backgroundColor: "#eef2f7",
  color: "#475569",
  fontWeight: 700,
  fontFamily: "Tajawal, sans-serif",
};

export type TTeacher = typeof teacher;

export default function TeacherProfile() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [teacherData, setTeacherData] = useState<TTeacher>(teacher);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleSave = (updatedTeacher: TeacherFormData) => {
    setTeacherData({
      ...teacherData,
      ...updatedTeacher,
      courses: teacherData.courses, // Keep original courses as they are not edited in this modal
    });
    setOpenEditModal(false);
  };
  return (
    <Box sx={{ maxWidth: "1250px", mx: "auto", px: isMobile ? 1 : 0 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        mb={isMobile ? 4 : 8}
        spacing={2}>
        <Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            spacing={1.5}
            gap={2}
            sx={{ mb: 1 }}>
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
                fontSize: { xs: "28px", md: "34px" },
                fontWeight: 800,
                color: "#0f172a",

                fontFamily: "Tajawal, sans-serif",
              }}>
              الملف الشخصي
            </Typography>
          </Stack>
          <Typography
            sx={{
              mt: 0.5,
              color: "#64748b",
              fontSize: "16px",
              fontFamily: "Tajawal, sans-serif",
            }}>
            إدارة معلوماتك الشخصية والمهنية
          </Typography>
        </Box>
        {/* CALL MODAL */}
        <EditInformationTeacher
          key={`${openEditModal}-${teacherData.fname}-${teacherData.lname}-${teacherData.email}-${teacherData.phone}`}
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          teacher={teacherData}
          onSave={handleSave}
        />
        <Button
          onClick={() => setOpenEditModal(true)}
          variant="contained"
          startIcon={<EditOutlinedIcon sx={{ ml: { xs: 1, sm: 3 } }} />}
          sx={{
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: "320px", md: "unset" },
            alignSelf: { xs: "center", md: "flex-start" },
            height: { xs: 56, md: 46 },
            px: { xs: 4, md: 3 },
            borderRadius: "999px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            boxShadow: "0 8px 20px rgba(15,23,42,0.16)",
            fontWeight: 700,

            fontSize: { xs: "20px", md: "15px" },
            fontFamily: "Tajawal, sans-serif",
            "&:hover": {
              background: "linear-gradient(135deg, #111827 0%, #334155 100%)",
            },
            "& .MuiButton-startIcon": {
              marginLeft: "8px",
              marginRight: 0,
            },
          }}>
          تعديل المعلومات
        </Button>
      </Stack>
      <TeacherProfileTopSections
        teacher={teacherData}
        sectionSx={sectionSx}
        chipSx={chipSx}
      />

      <TeacherProfileBottomSections
        teacher={teacherData}
        sectionSx={sectionSx}
        miniChipSx={miniChipSx}
      />
    </Box>
  );
}
