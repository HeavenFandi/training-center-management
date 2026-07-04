import React, { useState, useMemo, useEffect } from "react";
import { Typography, Box, Stack, Container, Grid, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SchoolIcon from "@mui/icons-material/School";
import { getAllInstitutes } from "../../api/instituteApi";
import type { Institute } from "../../api/instituteApi";

function PartnersSection() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const data = await getAllInstitutes();
        setInstitutes(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching institutes:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutes();
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(institutes.length / itemsPerPage);
  }, [institutes.length]);

  const currentCenters = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return institutes.slice(startIndex, endIndex);
  }, [currentPage, institutes]);

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
            disabled={currentPage === totalPages || totalPages <= 1 || loading}
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
            {loading ? (
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress sx={{ color: "white" }} size={24} />
              </Grid>
            ) : (
              currentCenters.map((institute) => (
                <Grid
                  key={institute.id}
                  size={{ xs:6, sm:6,md:3}}    
                 
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minWidth: { md: "200px" },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    onClick={() => navigate(`/main/institute/${institute.id}`)}
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
                      <SchoolIcon sx={{ color: "white" }} />
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
                      {institute.name}
                    </Typography>
                  </Stack>
                </Grid>
              ))
            )}
          </Grid>
          <IconButton
            onClick={handlePrevious}
            disabled={currentPage === 1 || totalPages <= 1 || loading}
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
