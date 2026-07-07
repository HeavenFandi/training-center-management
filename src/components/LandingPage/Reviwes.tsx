import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getTopRatings, RatingReview } from "../../api/ratingsApi";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopRatings(3); // Limit to 3 reviews as per original design
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("حدث خطأ أثناء جلب التقييمات");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <Box
        component="section"
        sx={{ width: "100%", py: 8, direction: "rtl", textAlign: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="section" sx={{ width: "100%", py: 8, direction: "rtl" }}>
        <Container maxWidth="lg">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ width: "100%", py: 8, direction: "rtl" }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="bold" 
          mb={6}
          sx={{ fontSize: { xs: "1.8rem", md: "2.125rem" } }}
        >
          ماذا يقول متدربونا
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: "24px",
            width: "100%",
          }}
        >
          {reviews.map((item: RatingReview) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 15px 35px rgba(19, 62, 101, 0.08)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { 
                  transform: "translateY(-12px)",
                  boxShadow: "0 25px 50px rgba(19, 62, 101, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                }
              }}
            >
              <CardContent
                sx={{ 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column",
                  p: 3 
                }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Rating value={item.rating} readOnly size="small" />
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: "text.secondary", 
                      lineHeight: 1.8,
                      fontSize: "0.95rem" 
                    }}
                  >
                    "{item.review}"
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: "1px solid",
                    borderColor: "divider" 
                  }}
                >
                  <Avatar 
                    sx={{ width: 45, height: 45 }}
                  >
                    {item.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {item.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.courseName}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Reviews;

