import React, { memo } from "react";
import { Box } from "@mui/material";
import HeroSection from "../components/LandingPage/HeroSection";
import CoursesRecomendation from "../components/LandingPage/CoursesRecomendation";
import WhyChooseUs from "../components/LandingPage/WhyChooseUs";
import Reviews from "../components/LandingPage/Reviwes";
import { useAppSelector } from "../store/hooks";

const LoadingPage = memo(() => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeroSection isLoggedIn={isAuthenticated} />
      <CoursesRecomendation />
      <WhyChooseUs />
      <Reviews />
    </Box>
  );
});

export default LoadingPage;


