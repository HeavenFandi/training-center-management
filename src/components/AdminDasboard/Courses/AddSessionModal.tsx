import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Grid,
  Chip,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AuthInput from "../../Auth/AuthInput";
import { TCourse, TSession } from "../../../types/cardType";
import { CreateTrainingSessionRequest } from "../../../api/trainingSessionApi";
import { useAddSessionForm } from "../../../hooks/adminDashboard/useAddSessionForm";
import { getTeachers, TeacherApiResponse } from "../../../api/teacherApi";

const daysList = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الأحد"];

interface Props {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onSave: (sessionData: CreateTrainingSessionRequest) => void;
  initialSession?: TSession | null;
}

const AddSessionModal: React.FC<Props> = ({ open, onClose, course, onSave, initialSession }) => {
  const [teachers, setTeachers] = React.useState<TeacherApiResponse[]>([]);
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
    handleTimeChange,
    classrooms,
    reset,
  } = useAddSessionForm({ onClose, onSave, initialSession, courseId: course?.id });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (e) {
        console.error("Failed to fetch teachers:", e);
      }
    };
    fetchTeachers();
  }, []);

  // When teachers are available, set teacherId to first available if it's still 0
  useEffect(() => {
    if (teachers.length > 0 && watch("teacherId") === 0) {
      setValue("teacherId", teachers[0].id);
    }
  }, [teachers, watch, setValue]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  // Helper to convert any time format (string or object) to "HH:mm" for the time input
  const formatTimeForInput = (time: any) => {
    if (!time) return "00:00";
    
    // If time is a string (already "HH:mm" or "HH:mm:ss")
    if (typeof time === "string") {
      const parts = time.split(":");
      return `${parts[0]?.padStart(2, "0") || "00"}:${parts[1]?.padStart(2, "0") || "00"}`;
    }
    
    // If time is an object with hour and minute
    if (typeof time === "object" && time !== null && "hour" in time && "minute" in time) {
      return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
    }
    
    return "00:00";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 0.5,
          backgroundColor: "#F8FAFC",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#F8FAFC",
        }}
      >
        <Typography variant="h6" fontWeight="900" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
          {initialSession ? `تعديل دورة: ${initialSession.title}` : `إنشاء دورة ${course ? `لكورس: ${course.title}` : ""}`}
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Tajawal", p: 3, pt: 0, bgcolor: "#F8FAFC" }}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <input type="hidden" {...register("courseId", { valueAsNumber: true })} />
          <Typography variant="subtitle2" fontWeight="bold" mb={1} color="#133E65">معلومات الدورة الأساسية</Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="المدرس "
                select
                {...register("teacherId", { valueAsNumber: true })}
                error={!!errors.teacherId}
                helperText={errors.teacherId?.message}
                compact
              >
                {teachers.map(inst => (
                  <MenuItem key={inst.id} value={inst.id}>
                    {inst.firstName} {inst.lastName}
                  </MenuItem>
                ))}
              </AuthInput>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="القاعة "
                select
                {...register("classroomId", { valueAsNumber: true })}
                error={!!errors.classroomId}
                helperText={errors.classroomId?.message}
                compact
              >
                {classrooms.map(classroom => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.number}
                  </MenuItem>
                ))}
              </AuthInput>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="السعر *"
                type="number"
                placeholder="0"
                {...register("price", { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="المقاعد المتاحة *"
                type="number"
                placeholder="0"
                {...register("availableSeats", { valueAsNumber: true })}
                error={!!errors.availableSeats}
                helperText={errors.availableSeats?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="الحد الأدنى للمقاعد *"
                type="number"
                placeholder="0"
                {...register("minSeats", { valueAsNumber: true })}
                error={!!errors.minSeats}
                helperText={errors.minSeats?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="عدد الجلسات *"
                type="number"
                placeholder="0"
                {...register("numberOfLectures", { valueAsNumber: true })}
                error={!!errors.numberOfLectures}
                helperText={errors.numberOfLectures?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="المدة *"
                placeholder="مثال: 4 أسابيع"
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="الحالة *"
                select
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
                compact
              >
                <MenuItem value="UPCOMING">قيد الانتظار</MenuItem>
                <MenuItem value="ACTIVE">نشطة</MenuItem>
                <MenuItem value="COMPLETED">مكتملة</MenuItem>
              </AuthInput>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="المتطلبات"
                  placeholder="أدخل المتطلبات"
                  {...register("requiredEquipment")}
                  error={!!errors.requiredEquipment}
                  helperText={errors.requiredEquipment?.message}
                  compact
                />
              </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight="bold" mt={1.5} mb={1} color="#133E65">جدول الجلسات</Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="تاريخ البداية *"
                type="date"
                {...register("startDate")}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="وقت البداية *"
                type="time"
                value={formatTimeForInput(watch("startTime"))}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="وقت الانتهاء *"
                type="time"
                value={formatTimeForInput(watch("endTime"))}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
                compact
              />
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, 
              gap: 3, 
              justifyContent: "space-between", 
              alignItems: { xs: "stretch", sm: "center" }, 
              mt: 4,
              borderTop: "1px solid rgba(19, 62, 101, 0.1)",
              pt: 3
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" fontWeight="bold" sx={{ color: "#133E65", whiteSpace: "nowrap" }}>الأيام:</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {daysList.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      onClick={() => toggleDay(day)}
                      color={selectedDays.includes(day) ? "primary" : "default"}
                      variant={selectedDays.includes(day) ? "filled" : "outlined"}
                      size="medium"
                      sx={{ 
                        borderRadius: "8px", 
                        fontSize: "0.85rem", 
                        height: "32px",
                        fontFamily: "Tajawal",
                        fontWeight: "500",
                        px: 0.5
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
              {errors.daysOfWeek && (
                <Typography color="error" variant="caption" sx={{ fontSize: "0.6rem", display: "block", mt: 0.2 }}>{errors.daysOfWeek.message}</Typography>
              )}
            </Box>

            <Box 
              sx={{ 
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: { xs: "center", sm: "flex-end" }, 
                mt: { xs: 2.5, sm: 0 },
                flexShrink: 0,
                flexWrap: "wrap",
                width: { xs: "100%", sm: "auto" },
                position: "relative",
                zIndex: 10,
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ 
                  color: "#71717A", 
                  borderColor: "#71717A",
                  "&:hover": { bgcolor: "rgba(113, 113, 122, 0.05)", borderColor: "#52525B" }, 
                  borderRadius: "10px", 
                  px: 4,
                  height: "44px",
                  fontSize: "0.95rem",
                  fontFamily: "Tajawal",
                  fontWeight: "bold",
                  minWidth: { xs: "calc(50% - 8px)", sm: "100px" }
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  bgcolor: "#133E65", 
                  "&:hover": { bgcolor: "#1e5a91" }, 
                  borderRadius: "10px", 
                  px: 4,
                  height: "44px",
                  fontSize: "0.95rem",
                  fontFamily: "Tajawal",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(19, 62, 101, 0.2)",
                  minWidth: { xs: "calc(50% - 8px)", sm: "120px" },
                }}
              >
                {initialSession ? "حفظ التعديلات" : "إنشاء الدورة"}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionModal;