import React from "react";
import { Box, Button, Container, Typography, Stack, Grid } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HeroImage from "../../assets/vectors/HeroSection-Girl.png";
import PartnersSection from "./PartnersSection";

import { useHeroLogic } from "../../hooks/landing/useHero";
import { styles } from "../../styles/HeroStyle";

interface HeroProps {
  isLoggedIn: boolean;
}

function HeroSection({ isLoggedIn }: HeroProps) {
  const { handleBrowseTrainingSessions, handleCreateAccount } = useHeroLogic();

  return (
    <Box sx={styles.heroWrapper}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction={{ xs: "column-reverse", md: "row" }}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={styles.imageContainer}>
              <Box sx={styles.mainCircle} />
              <Box sx={styles.dashedCircle} />
              <Box component="img" src={HeroImage} sx={styles.heroImg} />

              <Box
                sx={{
                  ...styles.glassCard,
                  top: "25%",
                  right: { xs: "-10%", md: "5%" },
                  animationDelay: "0s",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.85rem" } }}
                >
                  +100 دورات تدريبية متنوعة
                </Typography>
              </Box>

              <Box
                sx={{
                  ...styles.glassCard,
                  top: "35%",
                  left: { xs: "-5%", md: "10%" },
                  animationDelay: "1s",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.85rem" } }}
                >
                  +10k طالب في المنصة
                </Typography>
              </Box>

              <Box
                sx={{
                  ...styles.glassCard,
                  bottom: "15%",
                  right: { xs: "5%", md: "15%" },
                  animationDelay: "2s",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}
                >
                  UI/UX design
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.6rem", md: "0.7rem" },
                    color: "#777",
                  }}
                >
                  تقييم 4.8 ⭐
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} >
            <Stack spacing={2} sx={styles.textStack}>
              <Typography variant="h1" sx={styles.title}>
                بوابتك نحو التميز الأكاديمي <br /> والنجاح الوظيفي <br />
                <Box component="span" sx={{ color: "#1A73E8" }}>
                  {" "}
                  ! حدد مسارك الآن{" "}
                </Box>
              </Typography>

              <Typography sx={styles.subtitle}>
                نقدم لك دورات شاملة ومتخصصة في مجالات متنوعة يقدمها نخبة من
                الخبراء، سواء كنت تسعى لتعزيز معرفتك أو اكتساب مهارات جديدة لسوق
                العمل
              </Typography>
              <Stack direction="row" spacing={2} sx={{ width: "fit-content" }}>
                <Button
                  variant="contained"
                  endIcon={
                    <PlayCircleOutlineIcon
                      sx={{ mr: 1, transform: "rotate(180deg)" }}
                    />
                  }
                  sx={styles.primaryBtn}
                  onClick={handleBrowseTrainingSessions}
                >
                  تصفح الدورات
                </Button>

                {!isLoggedIn && (
                  <Button
                    variant="outlined"
                    sx={styles.secondaryBtn}
                    onClick={handleCreateAccount}
                  >
                    إنشاء حساب
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <PartnersSection />
    </Box>
  );
}

export default HeroSection;


