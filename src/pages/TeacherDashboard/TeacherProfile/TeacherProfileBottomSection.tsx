import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SectionTitle } from "./TeacherProfileComponenets";

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

type TeacherProfileBottomSectionsProps = {
  teacher: Teacher;
  sectionSx: SxProps<Theme>;
  miniChipSx: SxProps<Theme>;
};

export function TeacherProfileBottomSections({
  teacher,
  sectionSx,
  miniChipSx,
}: TeacherProfileBottomSectionsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Paper elevation={0} sx={{ ...sectionSx, mb: 3 }}>
        <SectionTitle title="النبذة المهنية" />
        <Typography
          sx={{
            color: "#475569",
            lineHeight: 2,
            fontSize: "18px",
            fontFamily: "Tajawal, sans-serif",
          }}>
          {teacher.bio}
        </Typography>
      </Paper>

      <Box
        sx={
          isMobile
            ? {
                p: 0,
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "none",
              }
            : sectionSx
        }>
        <SectionTitle title="الدورات التي يدرّسها" />

        <Stack spacing={2}>
          {teacher.courses.map((course) => (
            <Box
              key={course.id}
              sx={{
                p: 2,
                borderRadius: "18px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
                spacing={2}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#0f172a",
                      fontFamily: "Tajawal, sans-serif",
                    }}>
                    {course.title}
                  </Typography>

                  <Stack
                    gap={1}
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1, flexWrap: "wrap" }}>
                    <Chip label={`المدة: ${course.hours}`} sx={miniChipSx} />
                    <Chip
                      label={`الطلاب: ${course.students}`}
                      sx={miniChipSx}
                    />
                  </Stack>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={
                    <VisibilityOutlinedIcon sx={{ ml: 2, color: "#fff" }} />
                  }
                  fullWidth={isMobile}
                  sx={{
                    borderRadius: "12px",
                    px: 2.5,
                    fontWeight: 700,
                    ml: isMobile ? 0 : 2,
                    width: isMobile ? "100%" : "auto",
                    fontFamily: "Tajawal, sans-serif",
                    color: "#fff",
                    backgroundColor: "#091c39",
                  }}>
                  عرض
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
}
