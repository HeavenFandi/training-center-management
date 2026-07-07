import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  
  let errorMessage = "حدث خطأ غير متوقع";
  let errorCode = "خطأ";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorCode = "404";
      errorMessage = "عذراً، الصفحة التي تبحث عنها غير موجودة.";
    } else {
      errorCode = error.status.toString();
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
          direction: "rtl",
          fontFamily: "Tajawal, sans-serif",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: "#d32f2f", mb: 2 }} />
        
        <Typography variant="h1" fontWeight="bold" sx={{ color: "#051630", fontSize: { xs: "4rem", md: "6rem" } }}>
          {errorCode}
        </Typography>
        
        <Typography variant="h5" sx={{ color: "#50627b", mb: 2 }}>
          {errorMessage}
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#133E65",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#1e5a91" },
            }}
          >
            العودة للرئيسية
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              color: "#051630",
              borderColor: "#051630",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { borderColor: "#133E65", bgcolor: "rgba(5, 22, 48, 0.04)" },
            }}
          >
            الرجوع للخلف
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ErrorPage;
