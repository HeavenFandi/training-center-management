import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Stack,
  Box,
  Zoom,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useSnackbar } from "../../Context/SnackbarContext";

interface GenericDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  errorMessage?: string | null;
  isLoading?: boolean;
}

const GenericDeleteModal: React.FC<GenericDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "تأكيد حذف البيانات",
  description = "هل أنت متأكد من رغبتك في حذف",
  itemName,
  confirmButtonText = "حذف البيانات",
  cancelButtonText = "إلغاء",
  errorMessage,
  isLoading = false,
}) => {
  const { showSnackbar } = useSnackbar();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      dir="rtl"
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 1,
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          backgroundColor: "#F8FAFC",
        },
      }}>
      <DialogContent sx={{ py: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              bgcolor: "#fff1f0",
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s infinite",
            }}>
            <WarningAmberRoundedIcon sx={{ color: "#ff4d4f", fontSize: 45 }} />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight="900"
              color="#1a2c4e"
              gutterBottom
              sx={{ fontFamily: "Tajawal" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ lineHeight: 1.6, fontFamily: "Tajawal" }}
            >
              {description} <br />
              {itemName && (
                <b style={{ color: "#ff4d4f", fontSize: "1.1rem" }}>
                  "{itemName}"
                </b>
              )}
              {" "}؟
              <br /> لا يمكن التراجع عن هذا القرار لاحقاً.
            </Typography>
            {errorMessage && (
              <Typography
                variant="body2"
                color="#ff4d4f"
                sx={{ mt: 2, fontFamily: "Tajawal", fontWeight: "bold" }}
              >
                {errorMessage}
              </Typography>
            )}
          </Box>

          <Stack direction="row"  gap={2} sx={{ px: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              disabled={isLoading || !!errorMessage}
              sx={{
               
                bgcolor: "#ff4d4f",
                borderRadius: "14px",
                py: 1.2,
                fontWeight: "bold",
                fontFamily: "Tajawal",
                boxShadow: "0 4px 14px rgba(255, 77, 79, 0.3)",
                "&:hover": {
                  bgcolor: "#d32f2f",
                  boxShadow: "0 6px 20px rgba(255, 77, 79, 0.4)",
                },
                "&:disabled": {
                  bgcolor: "#ff9999",
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" sx={{ mx: 1 }} />
              ) : (
                confirmButtonText
              )}
            </Button>

            <Button
              variant="outlined"
             
              onClick={onClose}
              disabled={isLoading}
              sx={{
              
                borderRadius: "14px",
                color: "#64748b",
                borderColor: "#e2e8f0",
                fontWeight: "bold",
                fontFamily: "Tajawal",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8faff" },
                "&:disabled": {
                  borderColor: "#e2e8f0",
                  color: "#94a3b8",
                }
              }}>
              {cancelButtonText}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Dialog>
  );
};

export default memo(GenericDeleteModal);


