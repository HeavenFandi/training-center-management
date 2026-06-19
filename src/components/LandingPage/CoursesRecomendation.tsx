import React from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import CoursesCard from "../Cards/CoursesCard";
import { coursesData, Course } from "../../data/dataRecomm";

const CoursesRecommendation: React.FC = () => {
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

      <Grid 
        container 
        spacing={4} 
        sx={{ direction: "rtl" }}
        justifyContent="center"
      >
        {coursesData.map((course: Course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
           
            <CoursesCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoursesRecommendation;

