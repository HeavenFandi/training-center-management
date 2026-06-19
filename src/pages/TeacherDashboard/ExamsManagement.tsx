import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  Chip,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useRef } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, type ExamFormData } from "../../validation/ExamSchema";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type Exam = ExamFormData & { id: number };

const courses = ["رياضيات", "فيزياء", "كيمياء", "لغة إنجليزية"];
export default function ExamsManagement() {
  const navigate = useNavigate();
  const nextId = useRef(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema) as Resolver<ExamFormData>,
    defaultValues: {
      text: "",
      total: 0,
      passMark: 0,
      course: "",
      date: "",
    },
  });

  const [examsList, setExamsList] = useState<Exam[]>([]);

  const handleCreate: SubmitHandler<ExamFormData> = (data) => {
    const newExam: Exam = {
      id: nextId.current++,
      ...data,
    };

    setExamsList((prev) => [newExam, ...prev]);
    reset({ text: "", total: 0, passMark: 0, course: "", date: "" });
  };

  return (
    <Box dir="rtl" sx={{ p: { xs: 2, md: 4 } }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={1.5}
        gap={2}
        sx={{ mb: 1 }}>
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
        <Typography fontSize={28} fontWeight={700}>
          إدارة الاختبارات
        </Typography>
      </Stack>
      <Typography color="text.secondary" mb={2}>
        إنشاء الاختبارات وإدخال نتائج الطلاب بسهولة
      </Typography>

      <Card
        sx={{
          p: { xs: 2, md: 4 },
          mb: 5,
          borderRadius: "20px",
          background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
        }}>
        <Stack spacing={3}>
          <Typography fontWeight={600} fontSize={18}>
            إنشاء اختبار جديد
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="اسم الاختبار"
                {...register("text")}
                fullWidth
                error={!!errors.text}
                helperText={errors.text?.message}
                sx={inputStyle}
                InputLabelProps={{
                  sx: { right: 14, left: "auto" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="الدورة"
                {...register("course")}
                error={!!errors.course}
                helperText={errors.course?.message}
                sx={{
                  ...inputStyle,
                  width: "170px",
                }}>
                {courses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                type="date"
                {...register("date")}
                fullWidth
                error={!!errors.date}
                helperText={errors.date?.message}
                sx={inputStyle}
                InputLabelProps={{
                  shrink: true,
                  sx: { right: 14, left: "auto" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="العلامة الكاملة"
                type="number"
                {...register("total", { valueAsNumber: true })}
                fullWidth
                error={!!errors.total}
                helperText={errors.total?.message}
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="علامة النجاح"
                type="number"
                {...register("passMark", { valueAsNumber: true })}
                fullWidth
                error={!!errors.passMark}
                helperText={errors.passMark?.message}
                sx={inputStyle}
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleSubmit(handleCreate)()}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1,
                fontWeight: 600,
                background: "#0A1931",
                boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
              }}>
              إنشاء الاختبار
            </Button>
          </Stack>
        </Stack>
      </Card>

      {examsList.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 10,
            color: "#9ca3af",
          }}>
          <Typography fontSize={20} fontWeight={600}>
            لا يوجد اختبارات بعد
          </Typography>

          <Typography mt={1}>قم بإنشاء اختبار ليظهر هنا</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {examsList.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={item.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  background: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  },
                }}>
                <Stack spacing={2}>
                  <Typography fontWeight={700} fontSize={18}>
                    {item.text}
                  </Typography>
                  <Typography fontWeight={700} fontSize={14}>
                    {item.date}
                  </Typography>

                  <Stack
                    gap={2}
                    direction="row"
                    justifyContent="center"
                    spacing={2}
                    mt={1}>
                    <Chip
                      label={`العلامة : ${item.total}`}
                      sx={{
                        background: "#e0f2fe",
                        fontWeight: 600,
                      }}
                    />

                    <Chip
                      label={`النجاح: ${item.passMark}`}
                      sx={{
                        background: "#dcfce7",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  <Button
                    onClick={() => navigate("/teacher-dashboard/result")}
                    variant="outlined"
                    sx={{
                      color: "#fff",
                      mt: 2,
                      borderRadius: "10px",
                      fontWeight: 600,
                      backgroundColor: "#0A1931",
                    }}>
                    إدخال النتائج
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

const inputStyle = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#fff",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#0A1931",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0A1931",
      borderWidth: "2px",
    },
    "&.MuiInputLabel-root": {
      right: 14,
      left: "auto",
      transformOrigin: "right",
    },
  },
};
