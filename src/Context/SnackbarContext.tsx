import { createContext, useContext, useState } from "react";
import { Snackbar, Alert, Slide, SlideProps, Box, Typography, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarContextType {
  showSnackbar: (msg: string, type?: SnackbarSeverity) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = (
    msg: string, type: SnackbarSeverity = "success") => {
    console.log("showSnackbar called with message:", msg, "type:", type);
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const hideSnackbar = () => {
    console.log("hideSnackbar called");
    setOpen(false);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log("handleClose called, reason:", reason);
    if (reason === "clickaway") {
      return;
    }
    hideSnackbar();
  };

  const handleExited = () => {
    console.log("Snackbar exited, clearing state");
    setMessage("");
    setSeverity("success");
  };

  const getIcon = () => {
    switch (severity) {
      case "success": return <CheckCircleOutlineIcon />;
      case "error": return <ErrorOutlineIcon />;
      case "warning": return <WarningAmberOutlinedIcon />;
      case "info": return <InfoOutlinedIcon />;
      default: return null;
    }
  };

  const getColor = () => {
    switch (severity) {
      case "success": return "#10b981";
      case "error": return "#ef4444";
      case "warning": return "#f59e0b";
      case "info": return "#3b82f6";
      default: return "#10b981";
    }
  };

  console.log("SnackbarProvider - open:", open, "message:", message);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={TransitionSlideLeft}
        TransitionProps={{
          onExited: handleExited
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          icon={false}
          action={
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "rgba(255, 255, 255, 0.7)", "&:hover": { color: "#FFFFFF" } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            minWidth: "320px",
            maxWidth: "450px",
            backgroundColor: "#133E65",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            border: `1px solid ${getColor()}40`,
            display: "flex",
            alignItems: "center",
            p: "12px 16px",
            gap: 2,
            position: "relative",
            overflow: "hidden",
            direction: "rtl",
            fontFamily: "Tajawal",
            color: "#FFFFFF",
            "& .MuiAlert-action": {
              padding: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            "& .MuiAlert-icon": {
              display: "none",
            },
            "& .MuiAlert-message": {
              padding: 0,
              flex: 1,
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "4px",
              backgroundColor: getColor(),
              width: open ? "100%" : "0%",
              transition: open ? "width 4000ms linear" : "none",
            }}
          />

          

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#FFFFFF",
                mb: 0.2,
              }}
            >
              {severity === "success" ? "تم بنجاح" : severity === "error" ? "خطأ" : "تنبيه"}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "500",
              }}
            >
              {message}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
