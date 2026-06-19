import React from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import AdvantagesCard from "../Cards/AdvantagesCard";
import iconGreen from "../../assets/icons/iconGreen.png";
import iconClock from "../../assets/icons/iconClock.png";
import iconWorld from "../../assets/icons/iconWorld.png";

function WhyChooseUs() {
  const data = [
    { icon: iconGreen, title: "مدربين محترفين" },
    { icon: iconClock, title: "تعلم بالسرعة التي تناسبك" },
    { icon: iconClock, title: "تعلم بالسرعة التي تناسبك" },
    { icon: iconWorld, title: "محتوى متنوع" },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 0 },
        backgroundColor: "transparent", 
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              color: "#051630", 
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" } 
            }}
          >
            لماذا تختارنا
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#666", 
              fontWeight: 500,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6
            }}
          >
            نوفر لك أفضل تجربة تعليمية بمميزات استثنائية تساعدك على تحقيق أهدافك
          </Typography>
        </Box>

        <Box sx={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {data.map((item, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <AdvantagesCard
                    icon={item.icon}
                    title={item.title}
                    description="الوصول الدائم للمحتوى بشكل منظم"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default WhyChooseUs;

