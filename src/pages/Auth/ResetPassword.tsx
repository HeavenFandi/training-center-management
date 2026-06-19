import React, { useState, memo, useEffect } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import AuthLayout from "../../components/Auth/AuthLayout";
import SuccessModal from "../../components/Modal/SuccessModal";
import Amico from "../../assets/vectors/amico2.png";
import ResetPasswordForm from "../../components/Forms/ResetPasswordForm";
import { TResetPasswordType } from "../../validation/ResetPasswordSchema";
import { actResetPassword, resetOtpState } from "../../store/OTP/otpSlice";

const ResetPassword = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resetPasswordLoading, resetPasswordError, resetPasswordSuccess } = useAppSelector((state) => state.otp);

  const [open, setOpen] = useState(false);

  // Get email from localStorage
  const getEmail = () => {
    return localStorage.getItem("otpEmail") || "";
  };

  const handleFormSubmit = (data: TResetPasswordType) => {
    const email = getEmail();
    console.log("[DEBUG ResetPassword] Submitting password reset for email:", email);
    dispatch(actResetPassword({ email, newPassword: data.password }));
  };

  const handleModalClose = () => {
    setOpen(false);
    navigate("/");
  };

  // Effect to handle success
  useEffect(() => {
    if (resetPasswordSuccess) {
      setOpen(true);
      // Navigate to login after 2 seconds
      const timer = setTimeout(() => {
        navigate("/");
        dispatch(resetOtpState());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [resetPasswordSuccess, navigate, dispatch]);

  return (
    <AuthLayout
      sideTitle="!لا تنس مرة أخرى"
      sideSubtitle="احفظ كلمة السر في مكان آمن"
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
          zIndex: 10,
        }}
        onClick={() => navigate(-1)}
      >
        <IconButton size="small" color="inherit">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Stack
        spacing={4}
        alignItems="center"
        sx={{ width: "100%", maxWidth: 420, mx: "auto" }}
      >
        <Box component="img" src={Amico} alt="reset" sx={{ width: 100 }} />

        <Stack spacing={1} textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            إنشاء كلمة مرور جديدة
          </Typography>
          <Typography variant="body2" color="text.secondary">
            أدخل كلمة مرور قوية واحفظها في مذكّراتك أو في مكان آمن
          </Typography>
        </Stack>

        <ResetPasswordForm 
          onSubmit={handleFormSubmit} 
          loading={resetPasswordLoading} 
          error={resetPasswordError} 
        />
      </Stack>

      <SuccessModal
        open={open}
        onClose={handleModalClose}
        title="!تم بنجاح"
        message="تم تغيير كلمة المرور بنجاح"
        buttonText="تسجيل دخول الآن"
        navigateTo="/"
      />
    </AuthLayout>
  );
});

export default ResetPassword;


