import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import Logo from "../../assets/vectors/logo.png";
import { useHeader } from "../../hooks/common/useHeader";
import * as styles from "../../styles/headerStyle";
import MobileMenu from "../Heading/MobileMenu";

const pages = [
  { name: "تواصل معنا", path: "#contact-us", icon: <ContactSupportIcon /> },
  { name: "الدورات التدريبية", path: "/main/courses", icon: <SchoolIcon /> },
  { name: "الرئيسية", path: "/main", icon: <HomeIcon /> },
];

function Header({
  showIcons = false,
}: {
  showIcons?: boolean;
}) {
  const {
    anchorElNav,
    handleOpenNavMenu,
    handleCloseNavMenu,
    handleNavClick,
    handleAuthClick,
    isActiveLink,
    isLoggedIn,
  } = useHeader();

  return (
    <AppBar position="fixed" sx={styles.appBarStyle}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ flexDirection: "row-reverse", height: "80px" }}
        >
          <Stack
            direction="row-reverse"
            alignItems="center"
            spacing={1.5}
            sx={styles.logoSectionStyle}
            onClick={() => handleNavClick("/")}
          >
            <Box className="logo-container">
              <img src={Logo} alt="Logo" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "#051630",
                fontFamily: "Tajawal",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              أكاديمية المستقبل
            </Typography>
          </Stack>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavClick(page.path)}
                sx={styles.getNavButtonStyle({
                  path: page.path,
                  isActivePath: isActiveLink,
                })}
                startIcon={page.icon}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Stack
            direction="row-reverse"
            alignItems="center"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {showIcons && (
              <Stack direction="row-reverse" spacing={1}>
                <Tooltip title="الملف الشخصي">
                  <IconButton
                    onClick={() => handleNavClick("/main/student-dashboard")}
                    sx={{
                      color: isActiveLink("/main/student-dashboard")
                        ? "#6366F1"
                        : "rgba(5, 22, 48, 0.6)",
                      bgcolor: "rgba(5, 22, 48, 0.04)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        color: "#6366F1",
                        bgcolor: "rgba(99, 102, 241, 0.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <PersonIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
            <Button
              variant="contained"
              onClick={handleAuthClick}
              sx={styles.authButtonStyle(isLoggedIn)}
            >
              {isLoggedIn ? "تسجيل الخروج" : "تسجيل دخول"}
            </Button>
          </Stack>

          <MobileMenu
            anchorEl={anchorElNav}
            onOpen={handleOpenNavMenu}
            onClose={handleCloseNavMenu}
            onNavClick={handleNavClick}
            isActiveLink={isActiveLink}
            pages={pages}
            showIcons={showIcons}
            isLoggedIn={isLoggedIn}
            handleAuthClick={handleAuthClick}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;


