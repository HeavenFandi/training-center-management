import React from "react";
import {
  Popover,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useNotifications } from "../../Context/NotificationsContext";

interface NotificationsPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  anchorEl,
  onClose,
}) => {
  const { notifications, markAsRead } = useNotifications();
  const open = Boolean(anchorEl);

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlineIcon sx={{ color: "#2ecc71" }} />;
      case "error":
        return <CancelOutlinedIcon sx={{ color: "#e74c3c" }} />;
      case "warning":
        return <CancelOutlinedIcon sx={{ color: "#e74c3c" }} />; 
      default:
        return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "#1a9144";
      case "error":
        return "#b31b1b";
      case "warning":
        return "#e67e22";
      default:
        return "#133E65";
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          width: { xs: "calc(100vw - 32px)", sm: "400px" },
          maxWidth: "400px",
          borderRadius: "16px",
          mt: 1.5,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <Box dir="rtl">
       
        <Box
          sx={{
            backgroundColor: "#133E65",
            color: "white",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsIcon />
            <Typography variant="h6" fontWeight="bold">
              الاشعارات
            </Typography>
          </Stack>
          <Box
            sx={{
              backgroundColor: "white",
              color: "#133E65",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {notifications.length}
          </Box>
        </Box>

       
        <Stack divider={<Divider />}>
          {notifications.map((notif) => (
            <Box
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              sx={{
                p: 2,
                "&:hover": { backgroundColor: "#f8fafc" },
                cursor: "pointer",
                opacity: notif.isRead ? 0.6 : 1,
              }}
            >
              <Stack
                direction="row-reverse"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  sx={{
                    backgroundColor: getBadgeColor(notif.type),
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: "20px",
                    fontSize: "200",
                    fontWeight: "bold",
                  }}
                >
                  {notif.message}
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(notif.type)}
                  <Typography variant="body2" color="text.secondary">
                    {notif.time}
                  </Typography>
                
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Popover>
  );
};

export default NotificationsPopover;


