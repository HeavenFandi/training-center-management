import React, { memo, useState } from "react";
import {
  Stack,
  Button,
  Typography,
  Link as MuiLink,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, TSignInType } from "../../validation/SignInSchema";
import AuthInput from "../Auth/AuthInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface LoginFormProps {
  onSubmit: (data: TSignInType) => void;
  onForgetPassword: () => void;
  loading?: boolean;
  serverError?: string | null;
  onClearError?: () => void;
}

const LoginForm = memo(
  ({
    onSubmit,
    onForgetPassword,
    loading = false,
    serverError,
    onClearError,
  }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<TSignInType>({
      resolver: zodResolver(SignInSchema),
      mode: "onChange",
    });
    React.useEffect(() => {
      const subscription = watch(() => {
        if (serverError) {
          onClearError?.();
        }
      });

      return () => subscription.unsubscribe();
    }, [watch, serverError, onClearError]);

    return (
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={{ xs: 2, md: 2 }}
        sx={{ width: "100%", py: { xs: 1, md: 2 } }}>
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          <AuthInput
            label="الإيميل"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <AuthInput
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {serverError && (
          <Typography
            sx={{
              color: "#d32f2f",
              bgcolor: "#FFEBEE",
              border: "1px solid #FFCDD2",
              borderRadius: "10px",
              px: 2,
              py: 1,
              fontWeight: 700,
              textAlign: "center",
              fontSize: "0.9rem",
              fontFamily: "Tajawal",
            }}>
            {serverError}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            ليس لديك حساب؟
          </Typography>

          <MuiLink
            component={RouterLink}
            to="/create-account"
            underline="none"
            fontWeight="bold">
            إنشاء حساب
          </MuiLink>
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: loading
              ? "0 10px 20px rgba(19, 62, 101, 0.2)"
              : "0 10px 20px rgba(19, 62, 101, 0.2)",
            textTransform: "none",
            bgcolor: loading ? "#E8F5E9" : "#133E65",
            color: loading ? "#2E7D32" : "#fff",
            "&:hover": {
              bgcolor: loading ? "#E8F5E9" : "#1e5a91",
            },
            "&.Mui-disabled": {
              bgcolor: "#8EB69B",
              color: "#2E7D32",
              opacity: 1,
            },
          }}>
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>

        <MuiLink
          component="button"
          type="button"
          onClick={onForgetPassword}
          underline="none"
          sx={{
            display: "flex",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="body2" color="text.secondary">
            نسيت كلمة المرور؟
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 900,
              color: "#051630",
              "&:hover": { color: "primary.main" },
            }}>
            اضغط هنا
          </Typography>
        </MuiLink>
      </Stack>
    );
  },
);

export default LoginForm;
