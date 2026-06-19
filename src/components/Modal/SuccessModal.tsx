import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { SuccessModalProps } from "../../types/ModalType";

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  title,
  message,
  buttonText,
  navigateTo,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        }
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 70, sm: 85 },
            height: { xs: 70, sm: 85 },
            bgcolor: "#051630",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            boxShadow: "0 10px 25px rgba(5, 22, 48, 0.3)",
          }}
        >
          <CheckIcon sx={{ fontSize: { xs: 40, sm: 50 }, color: "white" }} />
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 1.5,
            color: "#051630",
            fontSize: { xs: "1.3rem", sm: "1.6rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "rgba(5, 22, 48, 0.7)",
            lineHeight: 1.6,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          {message}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            if (navigateTo) navigate(navigateTo);
            onClose?.();
          }}
          sx={{
            bgcolor: "#051630",
            color: "white",
            py: 1.8,
            borderRadius: "15px",
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 10px 25px rgba(5, 22, 48, 0.2)",
            "&:hover": {
              bgcolor: "#0a2a5a",
              boxShadow: "0 15px 35px rgba(5, 22, 48, 0.3)",
            },
          }}
        >
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;

