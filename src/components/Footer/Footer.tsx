import React from "react";
import { Box, Typography, Stack, IconButton, Container } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function Footer() {
  return (
    <Box
      id="contact-us"
      component="footer"
      sx={{
        backgroundColor: "#0b2545",
        color: "#fff",
        py: 4,
        direction: "rtl",
      }}
    >
      <Container maxWidth="lg">
        <Stack
         
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          textAlign="center"
        >
         
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            حقوق النشر محفوظة © 2026 أكاديمية المستقبل
          </Typography>

      
          <Typography variant="body2">
            تواصل معنا : +96399333422 | maoshor923@gmail.com
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="Instagram"
              sx={{
                color: "#fff",
                "&:hover": { color: "#E1306C" }, 
              }}
            >
              <InstagramIcon />
            </IconButton>

            <IconButton 
              aria-label="Facebook"
              sx={{ 
                color: "#fff",
                "&:hover": { color: "#1877F2" } 
              }}
            >
              <FacebookIcon />
            </IconButton>

            <IconButton 
              aria-label="WhatsApp"
              sx={{ 
                color: "#fff",
                "&:hover": { color: "#25D366" } 
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;

