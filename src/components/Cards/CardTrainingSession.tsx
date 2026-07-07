import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { TTrainingSessionListItem } from "../../types/cardType";
import { useNavigate } from "react-router-dom";

interface TTrainingSessionProps {
  trainingSession: TTrainingSessionListItem;
}
function CardTrainingSession({ trainingSession }: TTrainingSessionProps) {
  const navigate = useNavigate();

  const handleGoToDetails = () => {
    navigate(`/main/training-session-details/${trainingSession.id}`);
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        transition: "0.3s ease",
        direction: "rtl",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        },
      }}
    >
      <Box sx={{ height: 180, overflow: "hidden" }}>
        {trainingSession.image ? (
          <CardMedia
            component="img"
            height={180}
            image={trainingSession.image}
            alt={trainingSession.title}
            sx={{ objectFit: "cover", height: "100%", width: "100%" }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Tajawal",
                color: "#94a3b8",
                fontSize: "0.9rem",
              }}
            >
              لا توجد صورة
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent
        sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          <Box>
            <Typography
              sx={{
                textAlign: "right",
                fontWeight: 800,
                color: "#0b1b34",
                fontFamily: "Tajawal",
                fontSize: "1.2rem",
                mb: 0.5,
              }}
            >
              {trainingSession.title}
            </Typography>
            <Typography
              onClick={() => navigate(`/main/InstituteDetails`)}
              sx={{
                fontFamily: "Tajawal",
                color: "#7b8794",
                fontSize: "0.85rem",
                cursor: "pointer",
                "&:hover": { color: "#0b2c5a" },
                textAlign: "right",
              }}
            >
              {trainingSession.institute}
            </Typography>
          </Box>

          <Typography
            sx={{
              textAlign: "right",
              fontFamily: "Tajawal",
              color: "#475569",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.7em",
            }}
          >
            {trainingSession.description || "لا يوجد وصف متاح"}
          </Typography>

          <Stack
            direction="column"
            spacing={1}
            alignItems="flex"
            justifyContent="flex"
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonIcon sx={{ fontSize: "1rem", color: "#64748b" }} />
              <Typography
                onClick={() =>
                  trainingSession.teacherId &&
                  navigate(`/main/teacher-details/${trainingSession.teacherId}`)
                }
                sx={{
                  fontFamily: "Tajawal",
                  color: "#64748b",
                  fontSize: "0.85rem",
                  cursor: trainingSession.teacherId ? "pointer" : "default",
                  "&:hover": trainingSession.teacherId
                    ? { color: "#0b2c5a" }
                    : {},
                }}
              >
                {trainingSession.teacherName}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <LocationOnIcon sx={{ fontSize: "1rem", color: "#64748b" }} />
              <Typography
                sx={{
                  fontFamily: "Tajawal",
                  color: "#64748b",
                  fontSize: "0.85rem",
                }}
              >
                {trainingSession.location}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="flex"
              justifyContent="flex"
            >
              <ScheduleIcon sx={{ fontSize: "1rem", color: "#64748b" }} />
              <Typography
                sx={{
                  fontFamily: "Tajawal",
                  color: "#64748b",
                  fontSize: "0.85rem",
                  direction: "ltr",
                }}
              >
                {trainingSession.duration}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: "#0b2c5a",
            fontFamily: "Tajawal",
            fontSize: "1.1rem",
          }}
        >
          {trainingSession.price}$
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleGoToDetails}
          sx={{
            backgroundColor: "#0b2c5a",
            borderRadius: "20px",
            px: 3,
            fontFamily: "Tajawal",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#061e3f",
            },
          }}
        >
          التفاصيل
        </Button>
      </CardActions>
    </Card>
  );
}

export default CardTrainingSession;
