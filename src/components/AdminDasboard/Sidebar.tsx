import React, { memo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";

const defaultData = [
  { text: "لوحة التحكم", icon: <DashboardIcon />, path: "/admin-dashboard" },
  {
    text: "إدارة الطلاب",
    icon: <GroupIcon />,
    path: "/admin-dashboard/students",
  },
  {
    text: "إدارة المعلمين",
    icon: <CoPresentIcon />,
    path: "/admin-dashboard/teachers",
  },
  {
    text: "إدارة الكورسات",
    icon: <LibraryBooksIcon />,
    path: "/admin-dashboard/courses-management",
  },
  {
    text: "إدارة القاعات",
    icon: <AccountBalanceIcon />,
    path: "/admin-dashboard/rooms",
  },
  {
    text: "معلومات المعهد",
    icon: <BusinessIcon />,
    path: "/admin-dashboard/institute-info",
  },
];

const SidebarContent = ({ 
  onClose, 
  data 
}: { 
  onClose?: () => void;
  data?: Array<{ text: string; icon: React.ReactNode; path: string }>;
}) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const sidebarData = data || defaultData;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute } = useAppSelector((state) => state.institutes);

  useEffect(() => {
    const userId = user?.id;
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user?.id, currentInstitute]);

  const instituteName = currentInstitute?.name || "";

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280, 
        bgcolor: "#1a2c4e",
        color: "white",
        p: 3,
        height: isMobile ? "100%" : "auto",
        minHeight: isMobile ? "100%" : "100vh", 
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 6,
          gap: 2,
        }}
      >
        <SchoolIcon sx={{ fontSize: 32, color: "#f0b41c" }} />
        <Typography variant="h6" fontWeight="bold">
          {instituteName}
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {sidebarData.map((item, index) => {
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
                  flexDirection: "row-reverse",
                  bgcolor: isActive ? "#eef5ff" : "transparent",
                  color: isActive ? "#1a2c4e" : "white",
                  "&:hover": {
                    bgcolor: isActive ? "#eef5ff" : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
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

const Sidebar = ({ open, onClose, data }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <SidebarContent onClose={onClose} data={data} />
      </Drawer>
    );
  }

  return <SidebarContent data={data} />;
};

export default memo(Sidebar);
