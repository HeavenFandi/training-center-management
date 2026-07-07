import React from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function TrainingSessionsBanner({ searchTerm, onSearchChange }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(74, 127, 167, 1)",
        borderRadius: "10px",
        px: { xs: 2, md: 4 },
        py: { xs: 2.5, md: 3 },
        mb: 4,
        boxShadow: "0 8px 24px rgba(27, 87, 126, 0.12)",
      }}>
      <Grid container spacing={3} alignItems="center" direction="row-reverse">
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                color: "#0b1b34",
                fontWeight: 800,
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                fontFamily: "Tajawal",
                mb: 0.8,
              }}>
            ! اكتشف مساراتك التعليمية الجديدة 
            </Typography>

            <Typography
              sx={{
                color: "#16344f",
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                fontFamily: "Tajawal",
                lineHeight: 1.8,
              }}>
              تصفح مئات الدورات التدريبية المتاحة وابدأ رحلة التعلم اليوم مع
              أفضل المعاهد
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="ابحث عن اسم دورة..."
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fff",
                fontFamily: "Tajawal",
                height: "42px",
                "& input": {
                  textAlign: "right",
                  direction: "rtl",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default TrainingSessionsBanner;


