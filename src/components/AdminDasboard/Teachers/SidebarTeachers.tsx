import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import QuizIcon from "@mui/icons-material/Quiz";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AssessmentIcon from "@mui/icons-material/Assessment";
const data = [
  { text: "لوحة التحكم", icon: <DashboardIcon />, path: "/teacher-dashboard" },
  {
    text: "  الملف الشخصي",
    icon: <AccountCircleIcon />,
    path: "/teacher-dashboard/info",
  },
  {
    text: " تسجيل الحضور",
    icon: <GroupIcon />,
    path: "/teacher-dashboard/attendance",
  },
  {
    text: " جدول الإعطاء",
    icon: <CoPresentIcon />,
    path: "/teacher-dashboard/schedule",
  },
  {
    text: "  الاختبارات",
    icon: <QuizIcon />,
    path: "/teacher-dashboard/exams",
  },
  {
    text: "  نتائج الطلاب",
    icon: <AssessmentIcon />,
    path: "/teacher-dashboard/result",
  },
];

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        width: 280,
        bgcolor: "#1a2c4e",
        color: "white",
        p: 3,
        height: isMobile ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 6,
          gap: 2,
          flexDirection: "row",
        }}>
        <Avatar src="https://i.pravatar.cc/100?img=12" />
        <Typography variant="h6" fontWeight="bold">
          محمد أحمد
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {data.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (onClose) onClose();
                }}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 2,
                  bgcolor: isActive ? "#eef5ff" : "transparent",
                  color: isActive ? "#1a2c4e" : "white",
                  "&:hover": {
                    bgcolor: isActive ? "#eef5ff" : "rgba(255, 255, 255, 0.1)",
                  },
                }}>
                <ListItemIcon sx={{ color: "inherit", minWidth: "auto" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ mr: 2 }}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  data?: Array<{ text: string; icon: React.ReactNode; path: string }>;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <SidebarContent onClose={onClose} />
      </Drawer>
    );
  }

  return <SidebarContent />;
};

export default memo(Sidebar);


