import React, { useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resultSchema, ResultFormData } from "../../../../validation/ResultSchema";

type Result = {
  id: number;
  student: string;
  course: string;
  grade: number;
  status: "ناجح" | "راسب";
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedResult: Result | null;
  onSave: (result: ResultFormData) => void;
};

const EditResultModal = ({ open, onClose, selectedResult, onSave }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema) as Resolver<ResultFormData>,
    defaultValues: selectedResult ?? {
      student: "",
      course: "",
      grade: 0,
      status: "ناجح",
    },
  });

  const status = watch("status");

  useEffect(() => {
    reset(
      selectedResult ?? {
        student: "",
        course: "",
        grade: 0,
        status: "ناجح",
      },
    );
  }, [selectedResult, open, reset]);

  const handleSave = handleSubmit((data: ResultFormData) => {
    onSave(data);
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        dir="rtl"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 420 },
          bgcolor: "#fff",
          borderRadius: "20px",
          boxShadow: 24,
          p: 3,
          fontFamily: "Tajawal",
        }}>
        <Stack direction="row-reverse" justifyContent="space-between" mb={2}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Typography fontWeight="bold" fontSize={18}>
            تعديل النتيجة
          </Typography>

          <InfoOutlinedIcon sx={{ color: "#091c39" }} />
        </Stack>

        <Stack spacing={2}>
          <TextField
            label="اسم الطالب"
            fullWidth
            {...register("student")}
            error={!!errors.student}
            helperText={errors.student?.message}
            InputProps={{
              style: { textAlign: "right" },
            }}
          />

          <TextField
            label="الدورة"
            fullWidth
            {...register("course")}
            error={!!errors.course}
            helperText={errors.course?.message}
            InputProps={{
              style: { textAlign: "right" },
            }}
          />

          <TextField
            label="العلامة"
            type="number"
            fullWidth
            {...register("grade", { valueAsNumber: true })}
            error={!!errors.grade}
            helperText={errors.grade?.message}
            InputProps={{
              style: { textAlign: "right" },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" gap={3} mt={4}>
          <Button
            variant={status === "ناجح" ? "contained" : "outlined"}
            onClick={() => setValue("status", "ناجح", { shouldValidate: true })}
            sx={{
              borderRadius: "20px",
              px: 3,
              backgroundColor: status === "ناجح" ? "#4CAF50" : "transparent",
              color: status === "ناجح" ? "#fff" : "#4CAF50",
              borderColor: "#4CAF50",
              fontWeight: "bold",
            }}>
            ناجح
          </Button>

          <Button
            variant={status === "راسب" ? "contained" : "outlined"}
            onClick={() => setValue("status", "راسب", { shouldValidate: true })}
            sx={{
              borderRadius: "20px",
              px: 3,
              backgroundColor: status === "راسب" ? "#E74C3C" : "transparent",
              color: status === "راسب" ? "#fff" : "#E74C3C",
              borderColor: "#E74C3C",
              fontWeight: "bold",
            }}>
            راسب
          </Button>
        </Stack>

        {errors.status && (
          <Typography color="error" variant="body2" textAlign="center" mt={1}>
            {errors.status.message}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button
            onClick={onClose}
            sx={{
              color: "#999",
              fontWeight: "bold",
            }}>
            إلغاء
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#091c39",
              borderRadius: "10px",
              px: 3,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#0d2d4a",
              },
            }}>
            حفظ
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditResultModal;


