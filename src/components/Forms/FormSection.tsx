import React from "react";
import { Box, Typography, Grid } from "@mui/material";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <Box>
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      color="primary"
      sx={{ mb: 0.5, fontFamily: "Tajawal", fontSize: "0.9rem" }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

interface GridRowProps {
  children: React.ReactNode;
}

export const GridRow: React.FC<GridRowProps> = ({ children }) => (
  <Grid container spacing={1.5}>
    {children}
  </Grid>
);


