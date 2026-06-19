import React, { useState, useMemo } from "react";
import { Typography, Box, Stack, Container, Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import vector1 from "../../assets/icons/معهد الامل.png";
import vector2 from "../../assets/icons/مركز-الغد.png";
import vector3 from "../../assets/icons/معهد النور.png";
import vector4 from "../../assets/icons/مركز تعلم اللغات.png";

function PartnersSection() {
const centers = [
  { name: "معهد الأمل", img: vector1, path: "al-amal" },
  { name: "معهد النور", img: vector2, path: "ALNourInstitute" },
  { name: "مركز الغد", img: vector3, path: "al-ghad" },
  { name: "مركز تعلم اللغات", img: vector4, path: "languages-center" },
  { name: "مركز المستقبل", img: vector1, path: "future-center" },
  { name: "أكاديمية الإبداع", img: vector2, path: "creativity-academy" },
  { name: "معهد الريادة", img: vector3, path: "leadership-institute" },
  { name: "مركز التطوير المهني", img: vector4, path: "career-development-center" },
];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = useMemo(() => {
    return Math.ceil(centers.length / itemsPerPage);
  }, [centers.length]);

  const currentCenters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return centers.slice(startIndex, endIndex);
  }, [currentPage, centers]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Box
      sx={{
        py: 3,
        backgroundColor: "#0A1931",
        direction: "rtl",
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages <= 1}
            sx={{
              color: "white",
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
              flexShrink: 0,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
            sx={{ flex: 1 }}
          >
            {currentCenters.map((center, index) => (
              <Grid
                key={index}
                size={{ xs:6, sm:6,md:3}}    
               
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minWidth: { md: "200px" },
                }}
              >
                <Stack
                  component={Link}
                  to={center.path}
                  direction="row"
                  alignItems="center"
                  sx={{
                    gap: "15px",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s, opacity 0.2s",
                    "&:hover": {
                      opacity: 0.8,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "30px",
                      minWidth: "30px",
                    }}
                  >
                    <img
                      src={center.img}
                      alt={center.name}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: "white",
                      whiteSpace: "nowrap",
                      fontSize: { xs: "0.8rem", md: "1rem" },
                    }}
                  >
                    {center.name}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <IconButton
            onClick={handlePrevious}
            disabled={currentPage === 1 || totalPages <= 1}
            sx={{
              color: "white",
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
              flexShrink: 0,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}

export default PartnersSection;


