import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,

} from "@mui/material";
import { useSnackbar } from "../../../Context/SnackbarContext";
import { TCourse } from "../../../types/cardType";
import AuthInput from "../../Auth/AuthInput";

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onSave: (course: TCourse) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  course,
  onSave,
}) => {
  const [form, setForm] = useState<TCourse | null>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setForm(course);
  }, [course]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (form) {
      setForm((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (form) {
      onSave(form);
      showSnackbar("تم التعديل بنجاح", "success");
      onClose();
    }
  };

  if (!open || !course || !form) return null;

  return (
    <Dialog open={open} onClose={onClose} sx={{ direction: "rtl" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          p: 3,
          borderRadius: "20px",
          backgroundColor: "#F8FAFC",
          fontFamily: "Tajawal",
        }}>
        <Typography fontWeight="bold" mb={2} sx={{ fontFamily: "Tajawal" }}>
          تعديل بيانات الكورس
        </Typography>

        <Stack spacing={2}>
          <AuthInput
            label="اسم الكورس"
            name="title"
            value={form.title}
            onChange={handleChange}
            compact
          />

          <AuthInput
            label="الوصف"
            name="description"
            value={form.description}
            onChange={handleChange}
            compact
          />

          <AuthInput
            label="التصنيف"
            name="category"
            value={form.category}
            onChange={handleChange}
            compact
          />

          <AuthInput
            label="(متطلبات الكورس / المدرب)"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            compact
          />

          <AuthInput
            label="عدد الساعات"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            compact
          />
        </Stack>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{
            backgroundColor: "#133E65",
            color: "white",
            borderRadius: "50px",
            padding: { xs: "6px 16px", sm: "6px 20px" },
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: { xs: "0.75rem", sm: "1rem" },
            whiteSpace: "nowrap",
            boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
            "&:hover": { backgroundColor: "#0d2d4a" },
          }}>
          حفظ التعديلات
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditCourseModal;


