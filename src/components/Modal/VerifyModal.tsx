import React from "react";
import {
  Box,
  Typography,
  Link,
  Stack,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface VerifyModalProps {
  open: boolean;
  onClose: () => void;
  otp: string[];
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
  onVerify: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  loading?: boolean;
  error?: string | null;
}

const VerifyModal = ({
  open,
  onClose,
  otp,
  handleOtpChange,
  handleKeyDown,
  onVerify,
  onPaste,
  loading,
  error,
}: VerifyModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          position: "relative",
          borderRadius: "28px",
          p: 1,

          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          margin: { xs: 2, sm: "auto" },
        },
      }}>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 10,
          
          
          
          

          "&:hover": {
            background: "#f0f0f0",
          },
        }}>
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent
        sx={{ textAlign: "center", py: 4, px: { xs: 2, sm: 3 }, pt: 10 }}>
        <Typography variant="h5" fontWeight="bold" color="#051630" gutterBottom>
          التحقق من البريد الالكتروني
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 4 }}>
          أدخل الرمز المكون من 6 أرقام
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          justifyContent="center"
          onPaste={onPaste}
          sx={{ mb: 4 }}>
          {otp.map((data, index) => (
            <TextField
              key={index}
              id={`otp-${index}`}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                autoComplete: "one-time-code",
                style: {
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "12px 0",
                  fontSize: "1.2rem",
                },
              }}
              sx={{
                width: { xs: 40, sm: 48 },

                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&.Mui-focused fieldset": { borderColor: "#051630" },
                },

                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
              }}
              value={data}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </Stack>

        {error && (
          <Box
            sx={{
              width: "100%",
              bgcolor: "#FFEBEE",
              border: "1px solid #EF5350",
              borderRadius: "8px",
              px: 2,
              py: 1,
              mb: 2,
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
          fullWidth
          variant="contained"
          onClick={onVerify}
          startIcon={<CheckCircleIcon sx={{ ml: 1 }} />}
          disabled={loading}
          sx={{
            backgroundColor: "#133E65",
            py: 1.5,
            borderRadius: "12px",
            fontWeight: "900",
            fontSize: "1rem",
            fontFamily: "Tajawal",
            boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": { 
              backgroundColor: "#1e5a91",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
            },
            "&:disabled": {
              backgroundColor: "#90a4ae",
              cursor: "not-allowed",
            },
          }}>
          {loading ? "جاري التحقق..." : "تحقق من الرمز"}
        </Button>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Link
            component="button"
            onClick={() => alert("تم إعادة إرسال الكود بنجاح")}
            variant="body2"
            fontWeight="bold"
            underline="none"
            sx={{ mr: 1, color: "#051630" }}>
            إعادة إرسال
          </Link>
          <Typography variant="body2" color="textSecondary">
            لم يصلك الكود؟
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyModal;


