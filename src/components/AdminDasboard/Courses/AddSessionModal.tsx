import React, { useEffect, useState, useRef } from "react";
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
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import AuthInput from "../../Auth/AuthInput";
import { TCourse, TSession, Hall } from "../../../types/cardType";
import { SessionFormData } from "../../../validation/SessionSchema";
import { useAddSessionForm } from "../../../hooks/adminDashboard/useAddSessionForm";
import AvailableHallsModal, { hallsData } from "./AvailableHallsModal";

const daysList = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];

const instructors = [
  { id: 1, name: "م. أسامة العلي" },
  { id: 2, name: "م. خالد العلي" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onSave: (sessionData: Omit<TSession, "id" | "lectures">) => void;
  initialSession?: TSession | null;
}

const AddSessionModal: React.FC<Props> = ({ open, onClose, course, onSave, initialSession }) => {

  const [isHallsModalOpen, setIsHallsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
  } = useAddSessionForm({ onClose, onSave, initialSession });

  useEffect(() => {
    if (course && !initialSession) {
      setValue("courseId", course.id);
    }
  }, [course, initialSession, setValue]);

  const selectedHallId = watch("semester");
  const selectedHall = hallsData.find(h => h.id === selectedHallId);
  const currentImage = watch("image");

  const handleFormSubmit = (data: SessionFormData) => {
    onSubmit(data);
  };

  const handleSelectHall = (hall: Hall) => {
    setValue("semester", hall.id, { shouldValidate: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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
                  {...register("instructorId", { valueAsNumber: true })}
                  error={!!errors.instructorId}
                  helperText={errors.instructorId?.message}
                  compact
                >
                  {instructors.map(inst => (
                    <MenuItem key={inst.id} value={inst.id}>{inst.name}</MenuItem>
                  ))}
                </AuthInput>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: "#133E65", fontWeight: "bold", mb: 0.5, display: "block" }}>
                    القاعة 
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsHallsModalOpen(true)}
                    startIcon={<MeetingRoomIcon sx={{ ml: 1 }} />}
                    sx={{
                      height: "45px",
                      borderRadius: "12px",
                      borderColor: errors.semester ? "#d32f2f" : "rgba(19, 62, 101, 0.2)",
                      color: selectedHall ? "#133E65" : "#666",
                      fontFamily: "Tajawal",
                      fontWeight: "900",
                      justifyContent: "flex-start",
                      px: 2,
                      bgcolor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        borderColor: "#133E65",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                      }
                    }}
                  >
                    {selectedHall ? selectedHall.name : "عرض القاعات المتاحة"}
                  </Button>
                  {errors.semester && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                      {errors.semester.message}
                    </Typography>
                  )}
                  
                  <input type="hidden" {...register("semester")} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="السعر *"
                  placeholder="0"
                  {...register("price")}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  compact
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="المقاعد المتاحة *"
                  placeholder="0"
                  {...register("availableSeats")}
                  error={!!errors.availableSeats}
                  helperText={errors.availableSeats?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="الحد الأدنى للمقاعد *"
                  placeholder="0"
                  {...register("minCapacity")}
                  error={!!errors.minCapacity}
                  helperText={errors.minCapacity?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="عدد الجلسات *"
                  placeholder="0"
                  {...register("sessionsCount")}
                  error={!!errors.sessionsCount}
                  helperText={errors.sessionsCount?.message}
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
                  value={watch("status") || "قيد الانتظار"}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  compact
                >
                  <MenuItem value="نشطة">نشطة</MenuItem>
                  <MenuItem value="مكتملة">مكتملة</MenuItem>
                  <MenuItem value="قيد الانتظار">قيد الانتظار</MenuItem>
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
              
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" sx={{ color: "#133E65", fontWeight: "bold", mb: 0.5, display: "block" }}>
                  صورة الدورة
                </Typography>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    height: "45px",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: errors.image ? "#d32f2f" : "rgba(19, 62, 101, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    cursor: "pointer",
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#133E65",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                    }
                  }}
                >
                  <CloudUploadIcon sx={{ color: "#133E65", ml: 1, fontSize: "20px" }} />
                  <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: currentImage ? "#133E65" : "#666", fontWeight: currentImage ? "bold" : "normal", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentImage ? "تم اختيار ملف" : "رفع صورة (URL ملف)"}
                  </Typography>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Box>
                <input type="hidden" {...register("image")} />
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
                  {...register("startTime")}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <AuthInput
                  label="تاريخ الانتهاء *"
                  type="date"
                  {...register("endDate")}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
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
                {errors.days && (
                  <Typography color="error" variant="caption" sx={{ fontSize: "0.6rem", display: "block", mt: 0.2 }}>{errors.days.message}</Typography>
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
      <AvailableHallsModal
        open={isHallsModalOpen}
        onClose={() => setIsHallsModalOpen(false)}
        onSelect={(hall) => {
          handleSelectHall(hall);
          setIsHallsModalOpen(false);
        }}
        selectedHallId={selectedHallId}
      />
    </>
  );
};

export default AddSessionModal;


