import React, { memo } from "react";
import { Box } from "@mui/material";

import TrainingSessionDetailsContent from "../../components/Courses/Details/TrainingSessionDetailsContent";

const TrainingSessionDetails: React.FC = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        mt: "80px",
      }}
    >
      <Box dir="rtl" sx={{ flex: 1 }}>
        <TrainingSessionDetailsContent />
      </Box>
    </Box>
  );
};

export default memo(TrainingSessionDetails);


