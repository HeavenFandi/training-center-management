import React, { memo } from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import RegisterForm from "../../components/Forms/RegisterForm";
import { Box } from "@mui/material";

const Register = memo(() => {
  return (
    <AuthLayout
      sideTitle="أنشئ حسابك الآن"
      sideSubtitle="ابدأ رحلتك التعليمية وانضم إلى آلاف الطلاب والمدرسين"
    >
      <Box>
        <RegisterForm />
      </Box>
    </AuthLayout>
  );
});

export default Register;


