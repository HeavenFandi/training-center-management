import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import LoginImage from "../../assets/vectors/login.jpg";

interface ILayout {
  children?: React.ReactNode;
  sideTitle?: string;
  sideSubtitle?: string;
  isSuccessPage?: boolean;
}

const AuthLayout = ({ children, sideTitle, sideSubtitle }: ILayout) => {
  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100%",
        m: 0,
        p: 0,
        overflow: "hidden",
      }}
    >
      <Grid
        size={{ md: 6, xs: 12 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          direction: "rtl",
          p: { xs: 1, sm: 1.5, md: 2 }, // Reduced padding more
          overflowY: "auto",
          height: "100%",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(5, 22, 48, 0.1)",
            borderRadius: "10px",
          },
        }}
      >
        <Box sx={{ 
          width: "100%", 
          maxWidth: { xs: "100%", sm: 500, md: 550 }, 
          px: { xs: 0.5, sm: 1 },
          py: { xs: 0.5, md: 1 }, // Further reduced vertical padding
          minHeight: "min-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          my: "auto"
        }}>
          {children}
        </Box>
      </Grid>

      <Grid
        size={{ md: 6, xs: 12 }}
       
        sx={{
          display: { xs: "none", md: "flex" },
          backgroundImage: `url(${LoginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderTopLeftRadius: { md: "30px", lg: "40px" },
          borderBottomLeftRadius: { md: "30px", lg: "40px" },
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(5, 22, 48, 0.4)",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            zIndex: 2,
            p: 4,
            color: "white",
            width: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              {sideTitle}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              {sideSubtitle}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;


