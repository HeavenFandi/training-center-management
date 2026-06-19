import React, { useState } from "react";
import { Stack, IconButton, Box, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  TResetPasswordType,
} from "../../validation/ResetPasswordSchema"
import AuthInput from "../Auth/AuthInput";
import AuthButton from "../Auth/AuthButton";

interface ResetPasswordFormProps {
  onSubmit: (data: TResetPasswordType) => void;
  loading?: boolean;
  error?: string | null;
}

const ResetPasswordForm = ({ onSubmit, loading, error }: ResetPasswordFormProps) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  return (
    <Stack
      component="form"
      spacing={2}
      sx={{ width: "100%" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        label="كلمة السر الجديدة"
        type={showPass ? "text" : "password"}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          startAdornment: (
            <IconButton onClick={() => setShowPass(!showPass)} edge="start">
              {showPass ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />

      <AuthInput
        label="تأكيد كلمة السر الجديدة"
        type={showConfirm ? "text" : "password"}
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        InputProps={{
          startAdornment: (
            <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="start">
              {showConfirm ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />

      {error && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "#FFEBEE",
            border: "1px solid #EF5350",
            borderRadius: "8px",
            px: 2,
            py: 1,
          }}
        >
          <Typography
            sx={{
              color: "#C62828",
              fontWeight: 600,
              textAlign: "center",
              fontSize: "0.85rem",
              fontFamily: "Tajawal",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      <AuthButton type="submit" disabled={loading} sx={{ mt: 1 }}>
        {loading ? "جاري التغيير..." : "تغيير"}
      </AuthButton>
    </Stack>
  );
};

export default ResetPasswordForm;

