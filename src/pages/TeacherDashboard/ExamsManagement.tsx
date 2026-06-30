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
import { useState } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, type ExamFormData } from "../../validation/ExamSchema";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetActiveTrainingSessions from "../../store/TrainingSessions/actGetActiveTrainingSessions";
import actGetQuizzes, { Quiz } from "../../store/Quizzez/act/actGetQuizzes";
import actCreateQuiz from "../../store/Quizzez/act/actCreateQuiz";
import actUpdateQuiz from "../../store/Quizzez/act/actUpdateQuiz";
import actDeleteQuiz from "../../store/Quizzez/act/actDeleteQuiz";
type Exam = ExamFormData & { id: number };

export default function ExamsManagement() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const { activeSessions } = useAppSelector((state) => state.trainingSessions);
  const { quizzes } = useAppSelector((state) => state.quizzes);
  useEffect(() => {
    dispatch(actGetActiveTrainingSessions());
  }, [dispatch]);
  // Handle Edit
  const handleEdit = (exam: Quiz) => {
    setEditingQuizId(exam.id);

    reset({
      text: exam.name,
      total: exam.maxScore,
      passMark: exam.passingScore,
      course: String(exam.trainingSessionId),
      date: "",
    });
  };
  // const nextId = useRef(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
  const selectedSessionId = watch("course");

  useEffect(() => {
    if (selectedSessionId) {
      dispatch(actGetQuizzes(Number(selectedSessionId)));
    }
  }, [dispatch, selectedSessionId]);

  const handleCreate: SubmitHandler<ExamFormData> = async (data) => {
    if (editingQuizId) {
      await dispatch(
        actUpdateQuiz({
          id: editingQuizId,
          name: data.text,
          maxScore: data.total,
          passingScore: data.passMark,
          trainingSessionId: Number(data.course),
        }),
      ).unwrap();

      setEditingQuizId(null);
    } else {
      await dispatch(
        actCreateQuiz({
          name: data.text,
          maxScore: data.total,
          passingScore: data.passMark,
          trainingSessionId: Number(data.course),
        }),
      ).unwrap();
    }

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
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="الدورة"
                fullWidth
                {...register("course")}
                error={!!errors.course}
                helperText={errors.course?.message}
                sx={{
                  ...inputStyle,
                  width: "100%",
                }}>
                {activeSessions.map((session) => (
                  <MenuItem key={session.id} value={String(session.id)}>
                    {session.courseName}
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
              {editingQuizId ? "حفظ التعديل" : "إنشاء الاختبار"}
            </Button>
          </Stack>
        </Stack>
      </Card>

      {quizzes.length === 0 ? (
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
          {quizzes.map((exam) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={exam.id}>
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
                  <Stack direction="row-reverse" spacing={1} gap={1}>
                    {/* Edit */}
                    <Box
                      onClick={() => handleEdit(exam)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "#E8F5E9",
                        color: "#22C55E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: ".2s",
                        "&:hover": {
                          bgcolor: "#D1FAE5",
                          transform: "scale(1.05)",
                        },
                      }}>
                      <EditOutlinedIcon fontSize="small" />
                    </Box>

                    {/* Delete */}
                    <Box
                      onClick={() => dispatch(actDeleteQuiz(exam.id))}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "#FEECEC",
                        color: "#EF4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: ".2s",
                        "&:hover": {
                          bgcolor: "#FECACA",
                          transform: "scale(1.05)",
                        },
                      }}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#111827",
                      }}>
                      {exam.name}
                    </Typography>
                  </Stack>
                  <Typography fontWeight={700} fontSize={14}>
                    {new Date(exam.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </Typography>

                  <Stack
                    gap={2}
                    direction="row"
                    justifyContent="center"
                    spacing={2}
                    mt={1}>
                    <Chip
                      label={`العلامة : ${exam.maxScore}`}
                      sx={{
                        background: "#e0f2fe",
                        fontWeight: 600,
                      }}
                    />

                    <Chip
                      label={`النجاح: ${exam.passingScore}`}
                      sx={{
                        background: "#dcfce7",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  <Button
                    onClick={() =>
                      navigate("/teacher-dashboard/result", {
                        state: {
                          quizId: exam.id,
                          quizName: exam.name,
                        },
                      })
                    }
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
