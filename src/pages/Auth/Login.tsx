import React, { useState, memo, useCallback } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/vectors/logo.png";
import AuthLayout from "../../components/Auth/AuthLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifyModal from "../../components/Modal/VerifyModal";
import ResetPasswordModal from "../../components/Modal/ForgetPasswordModal";
import useLogin from "../../hooks/auth/useLogin";
import LoginForm from "../../components/Forms/LoginForm";
import { useAppDispatch } from "../../store/hooks";
import { resetAuthState } from "../../store/Auth/authSlice";

const Login = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const dispatch = useAppDispatch();

  const [openForgetModal, setOpenForgetModal] = useState(false);

  const {
    handleKeyDown,
    handleOtpChange,
    handleVerify,
    openModal,
    setOpenModal,
    otp,
    handlePaste,
    onsubmit,
    loading,
    error,
    handleSendOtp,
    sendLoading,
    sendError,
    verifyLoading,
    verifyError,
  } = useLogin();

  const handleClearError = useCallback(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  return (
    <AuthLayout
      sideTitle=" ! سجل دخول الآن"
      sideSubtitle="!انضم إلى الكورسات أو علمها أنت">
      <Box
        onClick={() => navigate("/main")}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "text.secondary",
        }}>
        <IconButton size="small" color="inherit">
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
          اضغط للرجوع
        </Typography>
      </Box>

      <Stack
        alignItems="center"
        spacing={1}
        sx={{ width: "100%", mt: 1, mb: 2 }}>
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{ width: "120px", height: "auto" }}
        />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            أهلاً بك في مركزنا
          </Typography>

          <Typography variant="body1" color="text.secondary">
            أدخل معلوماتك لتسجيل الدخول
          </Typography>
        </Box>
      </Stack>

      {successMessage && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "#E8F5E9",
            border: "1px solid #A5D6A7",
            borderRadius: "12px",
            px: 2,
            py: 1.2,
            mb: 2,
          }}>
          <Typography
            sx={{
              color: "#2E7D32",
              fontWeight: 700,
              textAlign: "center",
              fontSize: "0.9rem",
              fontFamily: "Tajawal",
            }}>
            {successMessage}
          </Typography>
        </Box>
      )}

      <LoginForm
        onSubmit={onsubmit}
        onForgetPassword={() => setOpenForgetModal(true)}
        loading={loading}
        serverError={error}
        onClearError={handleClearError}
      />

      <ResetPasswordModal
        open={openForgetModal}
        onClose={() => setOpenForgetModal(false)}
        onSendCode={handleSendOtp}
        loading={sendLoading}
        error={sendError}
      />

      <VerifyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        otp={otp}
        handleOtpChange={handleOtpChange}
        handleKeyDown={handleKeyDown}
        onVerify={handleVerify}
        onPaste={handlePaste}
        loading={verifyLoading}
        error={verifyError}
      />
    </AuthLayout>
  );
});

export default Login;
