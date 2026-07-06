import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

const AddCategoryModal: React.FC<Props> = ({ open, onClose, onSave, isLoading = false }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ direction: "rtl" }}>
        <DialogContent
          sx={{
            borderRadius: "25px",
            backgroundColor: "#F8FAFC",
            p: { xs: 2, md: 3 },
          }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}>
            <IconButton onClick={onClose} sx={{ color: "#999" }} disabled={isLoading}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="900"
              color="#1E3A5F"
              sx={{ fontSize: "1.1rem" }}>
              إضافة تصنيف جديد
            </Typography>
            <Box sx={{ width: { xs: 0, sm: 30 } }} />
          </Stack>

          <TextField
            fullWidth
            label="اسم التصنيف"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            disabled={isLoading}
            required
            sx={{ mb: 3, fontFamily: "Tajawal" }}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={onClose}
              disabled={isLoading}
              sx={{
                color: "#64748B",
                fontWeight: "bold",
                fontFamily: "Tajawal",
              }}>
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!name.trim() || isLoading}
              sx={{
                backgroundColor: "#091c39",
                color: "white",
                borderRadius: "50px",
                px: 4,
                py: 1,
                fontWeight: "bold",
                fontFamily: "Tajawal",
                "&:hover": { backgroundColor: "#0d2d4a" },
              }}>
              حفظ
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddCategoryModal;
