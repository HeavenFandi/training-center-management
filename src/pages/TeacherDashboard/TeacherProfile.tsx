import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetTeacherById from "../../store/teachers/act/actGetTeacherById";
import actGetTeacherCourseProgress from "../../store/teachers/act/actGetTeacherCourseProgress";

type Course = {
  id: number;
  title: string;
  hours: string;
  students: number;
};

type Teacher = {
  fname: string;
  lname: string;
  username: string;
  specialty: string;
  teacherCode: string;
  status: string;
  city: string;
  experience: string;
  students: number;
  coursesCount: number;
  email: string;
  phone: string;
  bio: string;
  image: string;
  courses: Course[];
};

const initialTeacher: Teacher = {
  fname: "أحمد",
  lname: "علي",
  username: "ahmed_ali",
  specialty: "مدرب تسويق رقمي",
  teacherCode: "T-2041",
  status: "نشط",
  city: "دمشق",
  experience: "+10",
  students: 200,
  coursesCount: 10,
  email: "ahmad@gmail.com",
  phone: "0987354546",
  bio: "خبير في مجال التسويق الرقمي مع خبرة تزيد عن 10 سنوات في إدارة الحملات الإعلانية، وبناء الخطط التسويقية، وتطوير الاستراتيجيات الرقمية وتحليل الأداء وتحسين نتائج الحملات.",
  image:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
  courses: [
    { id: 1, title: "التسويق الإلكتروني", hours: "30 ساعة", students: 45 },
    { id: 2, title: "إدارة الحملات الإعلانية", hours: "24 ساعة", students: 32 },
    { id: 3, title: "تحليل الأداء الرقمي", hours: "18 ساعة", students: 27 },
  ],
};

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState<Teacher>(initialTeacher);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const dispatch = useAppDispatch();

  const { selectedTeacher, courseProgress } = useAppSelector(
    (state) => state.teachers,
  );
  console.log("courseProgress", courseProgress);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.teacherId) {
      dispatch(actGetTeacherById(user.teacherId));
      dispatch(actGetTeacherCourseProgress(user.teacherId));
    }
  }, [dispatch]);
  useEffect(() => {
    if (selectedTeacher) {
      setTeacher((prev) => ({
        ...prev,
        fname: selectedTeacher.firstName || "",
        lname: selectedTeacher.lastName || "",
        username: selectedTeacher.username || "",
        specialty: selectedTeacher.specialization || "",
        city: selectedTeacher.address || "",
        experience: selectedTeacher.experienceYears
          ? `${selectedTeacher.experienceYears}`
          : "",
        email: selectedTeacher.email || "",
        phone: selectedTeacher.contactInfo || "",
        bio: selectedTeacher.cv || "",
        image: selectedTeacher.image || prev.image,
        students: selectedTeacher.numberOfStudents || 0,
        coursesCount: courseProgress.length,
      }));
    }
  }, [selectedTeacher, courseProgress.length]);

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 2.5 },
        boxSizing: "border-box",
      }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}>
          <Box>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <IconButton
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#091c39",
                  color: "#fff",
                  "&:hover": { bgcolor: "#0d2d4a" },
                }}>
                <ChevronRightIcon />
              </IconButton>

              <Typography
                sx={{
                  fontSize: { xs: 24, md: 30 },
                  fontWeight: 900,
                  color: "#091c39",
                  fontFamily: "Tajawal",
                }}>
                الملف الشخصي
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,
                color: "#64748b",
                fontSize: 14,
                fontFamily: "Tajawal",
              }}>
              إدارة معلوماتك الشخصية والمهنية
            </Typography>
          </Box>


        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: "28px",
            background: "#eef6ff",
            border: "1px solid #e5edf7",
            boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={3}
            gap={4}>
            <Avatar
              src={teacher.image}
              sx={{
                width: 120,

                height: 120,
                border: "5px solid #fff",
                boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
              }}
            />

            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "right" } }}>
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 36 },
                  fontWeight: 900,
                  color: "#091c39",
                  fontFamily: "Tajawal",
                }}>
                {teacher.fname} {teacher.lname}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 18,
                  mr: 3,
                  color: "#64748b",
                  fontWeight: 700,
                  fontFamily: "Tajawal",
                }}>
                {teacher.specialty}
              </Typography>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent={{ xs: "center", md: "flex-start" }}
                mt={2}>
                <Chip label={teacher.city} sx={chipStyle} />
                <Chip label={teacher.email} sx={chipStyle} />
                <Chip label={teacher.phone} sx={chipStyle} />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={mainCardStyle}>
          <Typography sx={sectionTitle}>المعلومات الأساسية</Typography>

          <Grid container spacing={2}>
            <InfoBox label="الاسم الأول" value={teacher.fname} />
            <InfoBox label="الاسم الأخير" value={teacher.lname} />
            <InfoBox label="اسم المستخدم" value={teacher.username} />
            <InfoBox label="التخصص" value={teacher.specialty} />

            <InfoBox label="المدينة" value={teacher.city} />
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Paper sx={mainCardStyle}>
                <Typography sx={sectionTitle}>النبذة المهنية</Typography>
                <Typography
                  sx={{
                    color: "#475569",
                    lineHeight: 2,
                    fontSize: 17,
                    fontWeight: 600,
                    fontFamily: "Tajawal",
                  }}>
                  {teacher.bio}
                </Typography>
              </Paper>

              <Paper sx={mainCardStyle}>
                <Typography sx={sectionTitle}>الدورات التي يدرّسها</Typography>

                <Stack spacing={2}>
                  {courseProgress.map((course) => (
                    <Paper
                      key={course.trainingSessionId}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "18px",
                        bgcolor: "#eef6ff",
                        border: "1px solid #dbe9f6",
                      }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "center" }}
                        spacing={2}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 20,
                              fontWeight: 900,
                              color: "#091c39",
                              fontFamily: "Tajawal",
                            }}>
                            {course.courseName}
                          </Typography>

                          <Stack direction="row" gap={1} flexWrap="wrap" mt={1}>
                            <Chip
                              label={`التقدم: ${course.progressPercentage}%`}
                              sx={smallChipStyle}
                            />

                            <Chip
                              label={`بدأت: ${course.startDate || "غير محدد"}`}
                              sx={smallChipStyle}
                            />
                          </Stack>
                        </Box>

                        <Button
                          onClick={() =>
                            setSelectedCourse({
                              id: course.trainingSessionId,
                              title: course.courseName,
                              hours: `${course.totalLectures} جلسة`,
                              students: course.numberOfStudents,
                            })
                          }
                          variant="contained"
                          startIcon={<VisibilityOutlinedIcon sx={{ ml: 1 }} />}
                          sx={{
                            bgcolor: "#091c39",
                            borderRadius: "12px",
                            px: 3,
                            fontWeight: 800,
                            fontFamily: "Tajawal",
                            "&:hover": { bgcolor: "#0d2d4a" },
                            "& .MuiButton-startIcon": {
                              marginLeft: "8px",
                              marginRight: 0,
                            },
                          }}>
                          عرض
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <StatCard
                title="إجمالي الطلاب"
                value={`${teacher.students} طالب`}
                icon={<Groups2OutlinedIcon />}
              />
              <StatCard
                title="الدورات التدريبية"
                value={`${teacher.coursesCount} دورات`}
                icon={<SchoolOutlinedIcon />}
              />
              <StatCard
                title="سنوات الخبرة"
                value={`${teacher.experience} سنة`}
                icon={<WorkspacePremiumOutlinedIcon />}
              />

              <Paper sx={mainCardStyle}>
                <Typography sx={sectionTitle}>التواصل</Typography>

                <ContactLine
                  icon={<EmailOutlinedIcon />}
                  label="البريد الإلكتروني"
                  value={teacher.email}
                />
                <ContactLine
                  icon={<PhoneIphoneOutlinedIcon />}
                  label="رقم الهاتف"
                  value={teacher.phone}
                />
                <ContactLine
                  icon={<LocationOnOutlinedIcon />}
                  label="المدينة"
                  value={teacher.city}
                />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>


      <Dialog
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "22px" } }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 900, color: "#091c39" }}>
              تفاصيل الدورة
            </Typography>

            <IconButton onClick={() => setSelectedCourse(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {selectedCourse && (
            <Stack spacing={2}>
              <Typography sx={{ fontSize: 24, fontWeight: 900 }}>
                {selectedCourse.title}
              </Typography>

              <Chip
                label={`المدة: ${selectedCourse.hours}`}
                sx={smallChipStyle}
              />

              <Chip
                label={`عدد الطلاب: ${selectedCourse.students}`}
                sx={smallChipStyle}
              />
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: "18px",
          bgcolor: "#eef6ff",
          border: "1px solid #dbe9f6",
        }}>
        <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            color: "#091c39",
            fontSize: 18,
            fontWeight: 900,
            mt: 0.5,
          }}>
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "20px",
        bgcolor: "#fff",
        border: "1px solid #e8eef7",
        boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <Box sx={{ color: "#4A7FA7", display: "flex" }}>{icon}</Box>

      <Box>
        <Typography sx={{ color: "#64748b", fontWeight: 800, fontSize: 13 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "#091c39", fontWeight: 900, fontSize: 20 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

function ContactLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1.5} mt={2}>
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "14px",
          bgcolor: "#eef6ff",
          color: "#4A7FA7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {icon}
      </Box>

      <Box>
        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>{label}</Typography>
        <Typography sx={{ color: "#091c39", fontWeight: 900 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

const mainCardStyle = {
  p: { xs: 2.5, md: 3 },
  borderRadius: "26px",
  bgcolor: "#fff",
  border: "1px solid #e8eef7",
  boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
};

const sectionTitle = {
  fontSize: { xs: 22, md: 28 },
  fontWeight: 900,
  color: "#091c39",
  mb: 2,
  fontFamily: "Tajawal",
};

const chipStyle = {
  bgcolor: "#eef6ff",
  color: "#091c39",
  fontWeight: 800,
  borderRadius: "10px",
};

const smallChipStyle = {
  bgcolor: "#eef2f7",
  color: "#475569",
  fontWeight: 800,
  borderRadius: "10px",
};

export default TeacherProfile;
