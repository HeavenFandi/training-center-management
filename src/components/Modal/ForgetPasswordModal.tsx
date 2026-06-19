import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AuthInput from "../Auth/AuthInput";
import ForgetImg from "../../assets/vectors/amico.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetPasswordSchema, TForgetPasswordType } from "../../validation/ForgetPasswordSchema";

import SendIcon from "@mui/icons-material/Send";

interface Props {
  open: boolean;
  onClose: () => void;
  onSendCode: (email: string) => void;
  loading?: boolean;
  error?: string | null;
}

const ForgetPasswordModal = ({ open, onClose, onSendCode, loading, error }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TForgetPasswordType>({
    resolver: zodResolver(ForgetPasswordSchema),
    mode: "onChange", 
  });

  const onSubmit = (data: TForgetPasswordType) => {
    onSendCode(data.email);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          backgroundColor: "#F8FAFC",
        }
      }}
    >
      <DialogContent
        sx={{
          position: "relative",
          textAlign: "center",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 15, top: 15 }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={ForgetImg}
            sx={{
              width: { xs: 120, sm: 150 },
              mb: 2,
              maxWidth: "100%",
              height: "auto",
            }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            نسيت كلمة المرور؟
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 3, px: { xs: 1, sm: 0 } }}>
            أدخل بريدك الإلكتروني أدناه لنقوم بإرسال رمز التحقق إليك
          </Typography>

          <Stack spacing={2}>
            <AuthInput
              label="البريد الإلكتروني"
              placeholder="example@gmail.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
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
                }}>
                <Typography
                  sx={{
                    color: "#C62828",
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontFamily: "Tajawal",
                  }}>
                  {error}
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<SendIcon sx={{ ml: 1, transform: "rotate(180deg)" }} />}
              disabled={loading}
              sx={{
                bgcolor: "#133E65",
                color: "white",
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "900",
                fontFamily: "Tajawal",
                fontSize: "1rem",
                boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "#1e5a91",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
                },
                "&:disabled": {
                  bgcolor: "#90a4ae",
                  cursor: "not-allowed",
                },
              }}>
              {loading ? "جاري الإرسال..." : "إرسال الرمز"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPasswordModal;

