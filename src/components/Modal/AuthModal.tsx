import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton, Stack, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

interface Tprops{
open: boolean;
handleClose:()=>void
}
function AuthModal({ open, handleClose }:Tprops) {
  const navigate = useNavigate();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: "center", position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 16, top: 16, color: "#051630" }}
        >
          <CloseIcon />
        </IconButton>

        <Stack alignItems="center" spacing={2} sx={{ mt: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              bgcolor: "#D7E6F5",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#051630",
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Box>

          <Typography variant="h5" fontWeight="900" sx={{ color: "#051630", fontFamily: "Tajawal" }}>
            تسجيل الدخول مطلوب
          </Typography>

          <Typography sx={{ color: "#5f6368", lineHeight: 1.8, fontFamily: "Tajawal" }}>
            عذراً لا يمكنك إضافة تقييم أو التسجيل بالكورس إلا بعد تسجيل الدخول
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleClose();
              navigate("/");
            }}
            sx={{
              mt: 2,
              bgcolor: "#133E65",
              borderRadius: "12px",
              py: 1.5,
              fontFamily: "Tajawal",
              fontWeight: "900",
              boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": { 
                bgcolor: "#1e5a91",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
              },
            }}
          >
            ذهاب إلى صفحة تسجيل الدخول
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;

