import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

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
          py: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            bgcolor: "#d32f2f",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(211, 47, 47, 0.4)",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: { xs: 60, sm: 70 }, color: "white" }} />
        </Box>
        
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#051630" }}>
          فشلت عملية الدفع
        </Typography>
        
        <Typography variant="h6" sx={{ color: "#50627b", mb: 2 }}>
          لم يتم إكمال عملية الدفع أو تم إلغاؤها.
        </Typography>
        
        <Typography variant="body1" sx={{ color: "#7b8794", mb: 2 }}>
          لا تقلق، لم يتم خصم أي مبلغ من حسابك.
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#051630",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#133e65" },
            }}
          >
            إعادة المحاولة
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => navigate("/main")}
            sx={{
              color: "#051630",
              borderColor: "#051630",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { borderColor: "#133e65", bgcolor: "rgba(5, 22, 48, 0.04)" },
            }}
          >
            العودة للرئيسية
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentCancel;