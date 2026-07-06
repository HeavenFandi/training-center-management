import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Heading/Header";
import { useAppSelector } from "../store/hooks";
import { Box } from "@mui/material";
import * as styles from "../styles/homeStyle";

const Home: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Box sx={styles.homeContainerStyle}>
      <Header showIcons={isAuthenticated} />

      <Box component="main" sx={styles.mainContentStyle}>
        {children || <Outlet />}
      </Box>

      <Footer />
    </Box>
  );
};

export default memo(Home);
