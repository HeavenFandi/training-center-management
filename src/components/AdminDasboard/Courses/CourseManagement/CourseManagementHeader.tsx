import React from "react";
import { Box, Typography, Button, Stack, IconButton, TextField, InputAdornment, CircularProgress } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface CourseManagementHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  isSearchLoading?: boolean;
}

const CourseManagementHeader: React.FC<CourseManagementHeaderProps> = ({ 
  onAddClick, 
  searchQuery, 
  onSearch, 
  onClearSearch,
  isSearchLoading 
}) => {
  return (
    <Stack
      direction="column"
      spacing={3}
      sx={{
        mb: 4,
        p: { xs: 1, sm: 0 },
      }}
      dir="rtl">
      {/* العنوان الرئيسي مع زر الإضافة */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              sx={{
                backgroundColor: "#091c39",
                color: "white",
                "&:hover": { backgroundColor: "#0d2d4a" },
                width: 28,
                height: 28,
              }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                color: "#091c39",
                fontWeight: "bold",
                fontSize: { xs: 24, sm: 30 },
                fontFamily: "Tajawal",
              }}>
              إدارة الكورسات
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              fontFamily: "Tajawal",
              fontSize: { xs: 14, sm: 16 }
            }}>
            أهلا بك في لوحة تحكم إدارة الكورسات المركزية
          </Typography>
        </Box>
        <Button
          onClick={onAddClick}
          variant="contained"
          sx={{
            backgroundColor: "#091c39",
            color: "white",
            borderRadius: "50px",
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
            fontFamily: "Tajawal",
            "&:hover": { backgroundColor: "#0d2d4a" },
          }}>
          إضافة كورس جديد
        </Button>
      </Stack>

      {/* حقل البحث تحت العنوان */}
      <TextField
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="ابحث عن كورس..."
        variant="standard"
        
        size="small"
sx={{
  width: "400px",
  backgroundColor: "transparent",
  borderRadius: "12px",

  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
    fontFamily: "Tajawal",
    fontSize: "16px",

    "&:before, &:after": {
      display: "none",
    },
  },

  "& .MuiInputBase-input": {
    py: 1.5,
    px: 2,

    "&::placeholder": {
      color: "#555", // غامق
      opacity: 1,    
      fontWeight: 500,
    },
  },
}}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isSearchLoading ? (
                <CircularProgress size={20} sx={{ color: "#091c39" }} />
              ) : (
                <SearchIcon sx={{ color: "#091c39" }} />
              )}
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={onClearSearch} size="small" sx={{ color: "#091c39" }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
      />
    </Stack>
  );
};

export default React.memo(CourseManagementHeader);


