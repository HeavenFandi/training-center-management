import React from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Category } from "../../../store/Courses/act/actGetCategories";

type Props = {
  instituteInput: string;
  categoryInput: string;
  minPriceInput: string;
  maxPriceInput: string;
  locationInput: string;
  categories: Category[];
  categoriesLoading: "idle" | "pending" | "succeeded" | "failed";
  categoriesError: string | null;
  setInstituteInput: (value: string) => void;
  setCategoryInput: (value: string) => void;
  setMinPriceInput: (value: string) => void;
  setMaxPriceInput: (value: string) => void;
  setLocationInput: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
};

function TrainingSessionsFilters({
  instituteInput,
  categoryInput,
  minPriceInput,
  maxPriceInput,
  locationInput,
  categories,
  categoriesLoading,
  categoriesError,
  setInstituteInput,
  setCategoryInput,
  setMinPriceInput,
  setMaxPriceInput,
  setLocationInput,
  onApplyFilters,
  onResetFilters,
}: Props) {
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
      fontFamily: "Tajawal",
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",
        p: 3,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}>
      <Typography
        sx={{
          textAlign: "right",
          fontWeight: 800,
          color: "#0b1b34",
          fontFamily: "Tajawal",
          fontSize: "1.1rem",
          mb: 2.5,
        }}>
        تصفية النتائج
      </Typography>

      <Stack spacing={2.2}>
        <Box>
          <Typography
            sx={{
              textAlign: "right",
              fontWeight: 600,
              mb: 1,
              color: "#1f2937",
              fontFamily: "Tajawal",
            }}>
            اسم المعهد
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="ادخل اسم المعهد"
            value={instituteInput}
            onChange={(e) => setInstituteInput(e.target.value)}
            sx={inputSx}
            InputProps={{
              style: {
                textAlign: "right",
                direction: "rtl",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              textAlign: "right",
              fontWeight: 600,
              mb: 1,
              color: "#1f2937",
              fontFamily: "Tajawal",
            }}>
            نطاق السعر ($)
          </Typography>

          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="إلى"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              sx={inputSx}
              InputProps={{
                style: {
                  textAlign: "right",
                  direction: "rtl",
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              placeholder="من"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              sx={inputSx}
              InputProps={{
                style: {
                  textAlign: "right",
                  direction: "rtl",
                },
              }}
            />
          </Stack>
        </Box>

        <Box>
          <Typography
            sx={{
              textAlign: "right",
              fontWeight: 600,
              mb: 1,
              color: "#1f2937",
              fontFamily: "Tajawal",
            }}>
            المحافظة
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="ادخل المحافظة"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            sx={{
              ...inputSx,
              "& input": { textAlign: "right", direction: "rtl" },
            }}></TextField>
        </Box>

        <Box>
          <Typography
            sx={{
              textAlign: "right",
              fontWeight: 600,
              mb: 1,
              color: "#1f2937",
              fontFamily: "Tajawal",
            }}>
            التصنيف
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            value={categoryInput}
            onChange={(e) => {
              console.log("Selected Category:", e.target.value);
              setCategoryInput(e.target.value);
            }}
            sx={inputSx}>
            <MenuItem value="">كل التصنيفات</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={onApplyFilters}
            sx={{
              mt: 1,
              backgroundColor: "#3C8DBC",
              color: "#fff",
              fontFamily: "Tajawal",
              fontWeight: 700,
              borderRadius: "10px",
              py: 1.1,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#2f7ea9",
                boxShadow: "none",
              },
            }}>
            تصفية
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={onResetFilters}
            sx={{
              borderRadius: "10px",
              fontFamily: "Tajawal",
              fontWeight: 700,
              py: 1.1,
              borderColor: "#3C8DBC",
              color: "#3C8DBC",
            }}>
            إعادة تعيين
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default TrainingSessionsFilters;


