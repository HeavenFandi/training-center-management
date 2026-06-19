import React, { useState, memo } from "react";
import { Box, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/AdminDasboard/Sidebar";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";

const MainDashboard: React.FC = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const data = [
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
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#e2eaf4",
        minHeight: "100vh",
        direction: "rtl",
      }}
    >
      <Sidebar
        open={openSidebar}
        data={data}
        onClose={() => setOpenSidebar(false)}
      />

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowX: "hidden" }}>
        <IconButton
          onClick={() => setOpenSidebar(true)}
          sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Outlet />
      </Box>
    </Box>
  );
};

export default memo(MainDashboard);


