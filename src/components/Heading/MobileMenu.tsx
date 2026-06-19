import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import * as styles from "../../styles/headerStyle";

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onNavClick: (path: string) => void;
  onNotificationsClick: (event: React.MouseEvent<HTMLElement>) => void;
  isActiveLink: (path: string) => boolean;
  pages: Array<{ name: string; path: string; icon: React.ReactNode }>;
  showIcons: boolean;
  isLoggedIn: boolean;
  handleAuthClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  anchorEl,
  onOpen,
  onClose,
  onNavClick,
  onNotificationsClick,
  isActiveLink,
  pages,
  showIcons,
  isLoggedIn,
  handleAuthClick,
}) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        onClick={onOpen}
        sx={{
          color: "#051630",
          bgcolor: "rgba(5, 22, 48, 0.04)",
          borderRadius: "12px",
        }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            ...styles.menuPaperStyle,
            width: "280px",
            mt: 1.5,
            borderRadius: "24px",
            padding: "8px",
          },
        }}
      >
        {showIcons && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Stack
              direction="row-reverse"
              justifyContent="space-between"
              spacing={2}
            >
              <Box
                onClick={() => onNavClick("/main/student-dashboard")}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  p: 1.5,
                  borderRadius: "16px",
                  bgcolor: isActiveLink("/main/student-dashboard")
                    ? "rgba(99, 102, 241, 0.1)"
                    : "rgba(5, 22, 48, 0.03)",
                  color: isActiveLink("/main/student-dashboard") ? "#6366F1" : "#051630",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <PersonIcon />
                <Typography
                  sx={{
                    fontFamily: "Tajawal",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  الملف الشخصي
                </Typography>
              </Box>

              <Box
                onClick={(e) => {
                  onClose();
                  onNotificationsClick(e);
                }}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  p: 1.5,
                  borderRadius: "16px",
                  bgcolor: "rgba(5, 22, 48, 0.03)",
                  color: "#051630",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <NotificationsIcon />
                <Typography
                  sx={{
                    fontFamily: "Tajawal",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  الإشعارات
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2, opacity: 0.5 }} />
          </Box>
        )}

        {pages.map((page) => (
          <MenuItem
            key={page.name}
            onClick={() => onNavClick(page.path)}
            sx={{
              borderRadius: "12px",
              mb: 0.5,
              p: 1.5,
              display: "flex",
              flexDirection: "row-reverse",
              gap: 2,
              color: isActiveLink(page.path) ? "#6366F1" : "#051630",
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
            }}
          >
            <Box sx={{ display: "flex", color: "inherit" }}>{page.icon}</Box>
            <Typography
              sx={{
                fontFamily: "Tajawal",
                fontWeight: isActiveLink(page.path) ? 800 : 600,
                flexGrow: 1,
                textAlign: "right",
              }}
            >
              {page.name}
            </Typography>
          </MenuItem>
        ))}

        <Divider sx={{ my: 1.5, opacity: 0.4 }} />

        <MenuItem
          onClick={handleAuthClick}
          sx={{
            borderRadius: "12px",
            justifyContent: "center",
            py: 1.8,
            bgcolor: isLoggedIn ? "rgba(211, 47, 47, 0.08)" : "#051630",
            color: isLoggedIn ? "#d32f2f" : "white",
            "&:hover": {
              bgcolor: isLoggedIn ? "rgba(211, 47, 47, 0.15)" : "#0a2245",
            },
          }}
        >
          <Typography sx={{ fontFamily: "Tajawal", fontWeight: "900" }}>
            {isLoggedIn ? "تسجيل الخروج" : "تسجيل دخول"}
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileMenu;


