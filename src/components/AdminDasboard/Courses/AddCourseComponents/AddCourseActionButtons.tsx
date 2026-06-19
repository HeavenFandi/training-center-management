import React from "react";
import { Stack, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface AddCourseActionButtonsProps {
  onClose: () => void;
}

const AddCourseActionButtons: React.FC<AddCourseActionButtonsProps> = ({ onClose }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      mt={3}
      gap={{ xs: 1, sm: 2 }}
    >
      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{
          bgcolor: "rgba(19, 62, 101, 0.05)",
          color: "#133E65",
          borderRadius: "12px",
          fontWeight: "900",
          fontSize: { xs: "0.9rem", sm: "1rem" },
          fontFamily: "Tajawal",
          boxShadow: "none",
          py: 1.5,
          border: "1px solid rgba(19, 62, 101, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": { 
            bgcolor: "rgba(19, 62, 101, 0.1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          },
        }}
      >
        إلغاء
      </Button>
      <Button
        fullWidth
        type="submit"
        variant="contained"
        startIcon={<SaveIcon sx={{ ml: 1 }} />}
        sx={{
          bgcolor: "#133E65",
          color: "white",
          borderRadius: "12px",
          fontWeight: "900",
          fontSize: { xs: "0.9rem", sm: "1rem" },
          fontFamily: "Tajawal",
          boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
          py: 1.5,
          transition: "all 0.3s ease",
          "&:hover": { 
            bgcolor: "#1e5a91",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
          },
        }}
      >
        حفظ بيانات الكورس
      </Button>
    </Stack>
  );
};

export default React.memo(AddCourseActionButtons);


