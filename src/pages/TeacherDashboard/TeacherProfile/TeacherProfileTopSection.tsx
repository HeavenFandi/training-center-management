import {
  Box,
  Typography,
  Avatar,
  Grid,
  Stack,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  SxProps,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { StatCardWide, ContactRow } from "./TeacherProfileComponenets";
import { Theme } from "@emotion/react";

type Course = {
  id: number;
  title: string;
  hours: string;
  students: number;
};

type Teacher = {
  fname: string;
  lname: string;
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
  name?: string;
};

type TeacherProfileTopSectionsProps = {
  teacher: Teacher;
  sectionSx: SxProps<Theme>;
  chipSx: SxProps<Theme>;
};

export function TeacherProfileTopSections({
  teacher,
  sectionSx,
  chipSx,
}: TeacherProfileTopSectionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {/* Top identity card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ width: "100%" }}>
          <Paper elevation={0} sx={sectionSx}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              alignItems={isMobile ? "center" : "center"}
              sx={{
                textAlign: isMobile ? "center" : "right",
              }}>
              <Avatar
                src={teacher.image}
                sx={{
                  width: isMobile ? 80 : 90,
                  height: isMobile ? 80 : 90,
                  border: "4px solid #fff",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                }}
              />

              <Box sx={{ flex: 1, width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: isMobile ? "24px" : "30px",
                    fontWeight: 800,
                    color: "#0f172a",
                    fontFamily: "Tajawal, sans-serif",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {`${teacher.fname} ${teacher.lname}`}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#475569",
                    fontSize: isMobile ? "16px" : "18px",
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.specialty}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  gap={1}
                  alignItems="center"
                  justifyContent={isMobile ? "center" : "flex-start"}
                  sx={{
                    mt: 2,
                    flexWrap: "wrap",
                    rowGap: 1,
                  }}>
                  <Chip label={`الكود: ${teacher.teacherCode}`} sx={chipSx} />
                  <Chip
                    label={`الحالة: ${teacher.status}`}
                    sx={{
                      ...chipSx,
                      backgroundColor: "#ecfdf5",
                      color: "#166534",
                    }}
                  />
                  <Chip label={`المدينة: ${teacher.city}`} sx={chipSx} />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Main content */}
      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
          justifyContent: isMobile ? "flex-start" : "space-between",
        }}
        direction={isMobile ? "column" : "row"}>
        {/* Basic info */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              ...sectionSx,
              width: isMobile ? "100%" : 390,
              minHeight: isMobile ? "auto" : 420,
              borderRadius: "28px",
              p: { xs: 3, md: 4 },
              boxSizing: "border-box",
            }}>
            <Typography
              sx={{
                fontSize: isMobile ? "26px" : "34px",
                fontWeight: 800,
                color: "#0f172a",
                mb: 3,
                fontFamily: "Tajawal, sans-serif",
                textAlign: "right",
              }}>
              المعلومات الأساسية
            </Typography>

            <Stack divider={<Divider />} spacing={2}>
              <Box>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "15px",
                    mb: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  الاسم الاول
                </Typography>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.fname}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "15px",
                    mb: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  الاسم الأخير
                </Typography>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.lname}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "15px",
                    mb: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  التخصص
                </Typography>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.specialty}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "15px",
                    mb: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  سنوات الخبرة
                </Typography>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.experience}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "15px",
                    mb: 1,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  المدينة
                </Typography>
                <Typography
                  sx={{
                    color: "#0f172a",
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: 700,
                    fontFamily: "Tajawal, sans-serif",
                  }}>
                  {teacher.city}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Stats + Contact */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Stack
            spacing={2}
            sx={{
              height: "100%",
              width: isMobile ? "100%" : 500,
              alignItems: "stretch",
            }}>
            <StatCardWide
              icon={<Groups2OutlinedIcon />}
              label="إجمالي الطلاب"
              value={`${teacher.students}`}
              sectionSx={sectionSx}
            />

            <StatCardWide
              icon={<SchoolOutlinedIcon />}
              label="الدورات التدريبية"
              value={`${teacher.coursesCount}`}
              sectionSx={sectionSx}
            />

            <StatCardWide
              icon={<WorkspacePremiumOutlinedIcon />}
              label="سنوات الخبرة"
              value={teacher.experience}
              sectionSx={sectionSx}
            />

            <Paper
              elevation={0}
              sx={{
                ...sectionSx,
                p: 3,
                width: "100%",
                height: isMobile ? "auto" : 60,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box",
              }}>
              <Typography
                sx={{
                  fontSize: isMobile ? "24px" : "30px",
                  fontWeight: 800,
                  mb: 2,
                  fontFamily: "Tajawal, sans-serif",
                  color: "#0f172a",
                  textAlign: "right",
                }}>
                معلومات التواصل
              </Typography>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <ContactRow
                  icon={<MailOutlineRoundedIcon />}
                  label="البريد الإلكتروني"
                  value={teacher.email}
                />
                <ContactRow
                  icon={<PhoneIphoneRoundedIcon />}
                  label="رقم الهاتف"
                  value={teacher.phone}
                />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
