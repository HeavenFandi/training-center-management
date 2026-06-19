import { Box, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import SidebarTeachers from "../../components/AdminDasboard/Teachers/SidebarTeachers";
import { useTeacherLayout } from "../../hooks/teacherDashboard/useTeacherLayout";
const TeacherLayout = () => {
  const {
    openSidebar,
    handleOpenSidebar,
    handleCloseSidebar,
  } = useTeacherLayout();

  return (
    <Box
      sx={{
        display: "flex",
        direction: "rtl",
        minHeight: "100vh",
      
      }}>
      <SidebarTeachers 
        open={openSidebar} 
        onClose={handleCloseSidebar} 
      />

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflowX: "hidden" }}>
        <IconButton
          onClick={handleOpenSidebar}
          sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
          <MenuIcon />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  );
};

export default TeacherLayout;


