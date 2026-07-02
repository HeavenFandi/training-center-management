import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import TopEnrolledCourseCard from "./TopEnrolledCourseCard";
import {
  getTopEnrolledTrainingSessions,
  TrainingSessionResponse,
} from "../../api/trainingSessionApi";

const CoursesRecommendation: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopEnrolled = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTopEnrolledTrainingSessions();
        setSessions(response.slice(0, 3));
      } catch (err: any) {
        setError(err?.message || "فشل تحميل الكورسات الأكثر تسجيلاً.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopEnrolled();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#003060",
            mb: 2,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          الكورسات الأكثر تسجيلاً
        </Typography>
       
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <Typography color="error.main">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ direction: "rtl" }} justifyContent="center">
          {sessions.map((session) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
              <TopEnrolledCourseCard session={session} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CoursesRecommendation;
