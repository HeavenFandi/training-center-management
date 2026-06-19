import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { TCourseListItem, TTrainingSessionListItem } from "../../types/cardType";
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
    <>
      <Card
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
          transition: "0.25s ease",
          direction: "rtl",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          },
        }}
      >
        {trainingSession.image && (
          <CardMedia
            component="img"
            height="180"
            image={trainingSession.image}
            alt={trainingSession.title}
            sx={{
              objectFit: "cover",
            }}
          />
        )}
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
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
              <Stack direction="row" spacing={1}  alignItems="center" justifyContent={"space-between"}>
                <Typography
                  onClick={() => navigate(`/main/ALNourInstitute`)}
                  sx={{
                    fontFamily: "Tajawal",
                    color: "#7b8794",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    "&:hover": { color: "#0b2c5a" }
                  }}
                >
                  {trainingSession.institute}
                </Typography>
                {trainingSession.location && (
                  <Typography
                    sx={{
                      fontFamily: "Tajawal",
                      color: "#3C8DBC",
                      fontSize: "0.8rem",
                      bgcolor: "#ebf5fb",
                      px: 1,
                      borderRadius: "4px",
                      fontWeight: 700
                    }}
                  >
                    {trainingSession.location}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    fontFamily: "Tajawal",
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
                  }}
                >
                  التفاصيل
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default CardTrainingSession;


