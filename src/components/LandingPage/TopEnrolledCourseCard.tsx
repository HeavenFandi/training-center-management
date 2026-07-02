import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { TrainingSessionResponse } from "../../api/trainingSessionApi";

interface Props {
  session: TrainingSessionResponse;
}

const fallbackImage =
  "https://via.placeholder.com/640x360/edf2f7/64748b?text=%D9%84%D8%A7+%D8%AA%D9%8 worldview";

const statusLabelMap: Record<string, string> = {
  UPCOMING: "قيد الانتظار",
  ONGOING: "نشطة",
};

const statusColorMap: Record<string, string> = {
  UPCOMING: "#f59e0b",
  ONGOING: "#10b981",
};

const getCleanHours = (duration: string | null | undefined): string => {
  if (!duration) return "--";
  const matches = String(duration).trim().match(/\d+/g);
  return matches && matches.length > 0 ? matches[matches.length - 1] : "--";
};

const TopEnrolledCourseCard: React.FC<Props> = ({ session }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    image,
    courseName,
    status,
    courseDescription,
    duration,
    numberOfLectures,
    studentEnrollmentCount,
  } = session;

  const statusLabel = status ? statusLabelMap[status] || status : "غير متاح";
  const statusColor = status
    ? statusColorMap[status] || theme.palette.primary.main
    : theme.palette.grey[600];

  const cleanHours = getCleanHours(duration);

  const handleCardClick = (): void => {
    navigate(`/training-sessions/${session.id}`);
  };

  return (
    <Card
      dir="rtl"
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 14px 40px rgba(15, 23, 42, 0.12)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 26px 50px rgba(15, 23, 42, 0.18)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={220}
          image={image || fallbackImage}
          alt={courseName || "دورة تدريبية"}
          sx={{ objectFit: "cover", width: "100%" }}
        />
        <Chip
          label={statusLabel}
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            fontWeight: 700,
            color: theme.palette.common.white,
            backgroundColor: statusColor,
            borderRadius: "999px",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
          }}
        />
      </Box>

      {/* flexGrow يضمن توزيع المساحات البيضاء بالتساوي ودفع العدادات للأسفل دائماً */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          flexGrow: 1, 
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            textAlign: "right",
            color: "text.primary",
          }}
        >
          {courseName || "اسم الدورة غير متوفر"}
        </Typography>

        {/* تم حذف الـ minHeight الثابتة لتختفي الفجوة الكبيرة في التصميم */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "right",
            lineHeight: 1.8,
          }}
        >
          {courseDescription || "لا يوجد وصف متاح لهذه الدورة."}
        </Typography>


        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid rgba(15, 23, 42, 0.06)",
            pt: 2,
            mt: "auto", 
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
            spacing={1}
            sx={{ px: 0.5 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 0, flex: 1, gap: 0.5 }}
            >
              <PersonIcon sx={{ color: "#475569", fontSize: 18 }} />
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                {studentEnrollmentCount != null
                  ? `${studentEnrollmentCount} طالب`
                  : "غير معروف"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 0, flex: 1, gap: 0.5 }}
            >
              <MenuBookIcon sx={{ color: "#475569", fontSize: 18 }} />
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                {numberOfLectures != null
                  ? `${numberOfLectures} حصة`
                  : "غير معروف"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 0, flex: 1, gap: 0.5 }}
            >
              <AccessTimeIcon sx={{ color: "#475569", fontSize: 18 }} />
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                {`${cleanHours} ساعة`}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopEnrolledCourseCard;