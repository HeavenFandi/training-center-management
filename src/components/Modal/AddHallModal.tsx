import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Grid,
  IconButton,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hallSchema, HallFormData } from "../../validation/HallSchema";
import AuthInput from "../Auth/AuthInput";

interface AddHallModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (hall: HallFormData) => void;
  initialData?: { hall: string; capacity: number; equipment: string } | null;
}

const AddHallModal: React.FC<AddHallModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HallFormData>({
    resolver: zodResolver(hallSchema) as Resolver<HallFormData>,
    defaultValues: {
      hall: initialData?.hall ?? "",
      capacity: initialData?.capacity ?? 0,
      equipment: initialData?.equipment ?? "",
    },
  });

  useEffect(() => {
    reset({
      hall: initialData?.hall ?? "",
      capacity: initialData?.capacity ?? 0,
      equipment: initialData?.equipment ?? "",
    });
  }, [initialData, open, reset]);

  const handleSave = handleSubmit((data) => {
    onSave(data);
    onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="rtl"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: "#F8FAFC",
          p: 0.5,
        },
      }}>
      <Box
        sx={{
          p: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#F8FAFC",
        }}>
        <Typography
          variant="h6"
          fontWeight="900"
          color="#133E65"
          sx={{ fontFamily: "Tajawal" }}>
          {initialData ? "تعديل بيانات القاعة" : "إضافة قاعة جديدة"}
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, pt: 1, bgcolor: "#F8FAFC" }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="رقم القاعة"
              placeholder="مثلاً: A01"
              {...register("hall")}
              error={!!errors.hall}
              helperText={errors.hall?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="السعة"
              placeholder="مثلاً: 20"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AuthInput
              label="التجهيزات"
              {...register("equipment")}
              error={!!errors.equipment}
              helperText={errors.equipment?.message}
              compact
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            startIcon={<SaveIcon sx={{ ml: 1 }} />}
            sx={{
              backgroundColor: "#133E65",
              color: "white",
              borderRadius: "12px",
              py: 1.5,
              fontWeight: "900",
              fontSize: "1rem",
              fontFamily: "Tajawal",
              boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#1e5a91",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
              },
            }}>
            {initialData ? "حفظ التعديلات" : "إضافة القاعة"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddHallModal;


