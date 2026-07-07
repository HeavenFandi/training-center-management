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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller } from "react-hook-form";

import AuthInput from "../../Auth/AuthInput";
import { TCourse, TSession } from "../../../types/cardType";
import { CreateTrainingSessionRequest } from "../../../api/trainingSessionApi";
import { useAddSessionForm } from "../../../hooks/adminDashboard/useAddSessionForm";
import {
  getTeachersByInstituteId,
  TeacherApiResponse,
} from "../../../api/teacherApi";

const daysList = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الأحد"];

interface Props {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  instituteId?: number;
  onSave: (
    sessionData: CreateTrainingSessionRequest,
    imageFile: File | null,
  ) => void;
  initialSession?: TSession | null;
  isLoading?: boolean;
}

const AddSessionModal: React.FC<Props> = ({
  open,
  onClose,
  course,
  instituteId,
  onSave,
  initialSession,
  isLoading,
}) => {
  const [teachers, setTeachers] = React.useState<TeacherApiResponse[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = React.useState(true);
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
    handleTimeChange,
    classrooms,
    reset,
    selectedImageFile,
    imagePreview,
    imageError,
    fileInputRef,
    handleFileChange,
    clearImage,
    isLoadingSessionDetails,
    selectedTrainingSession,
    selectedClassroom,
  } = useAddSessionForm({
    onClose,
    onSave,
    initialSession,
    courseId: course?.id,
    teachers,
  });

  // Reset form when modal opens or closes
  React.useEffect(() => {
    reset();
  }, [open, reset]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoadingTeachers(true);
        if (instituteId) {
          const data = await getTeachersByInstituteId(instituteId);
          setTeachers(data);
        }
      } catch (e) {
        console.error("Failed to fetch teachers:", e);
      } finally {
        setIsLoadingTeachers(false);
      }
    };
    if (instituteId) {
      fetchTeachers();
    }
  }, [instituteId]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  // Helper to convert any time format (string or object) to "HH:mm" for the time input
  const formatTimeForInput = (time: any) => {
    if (!time) return "";

    // If time is a string (already "HH:mm" or "HH:mm:ss")
    if (typeof time === "string") {
      const parts = time.split(":");
      const hour = parts[0]?.padStart(2, "0");
      const minute = parts[1]?.padStart(2, "0");
      if (hour && minute) {
        return `${hour}:${minute}`;
      }
      return "";
    }

    // If time is an object with hour and minute
    if (
      typeof time === "object" &&
      time !== null &&
      "hour" in time &&
      "minute" in time
    ) {
      return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
    }

    return "";
  };

  // Determine if we need to show loading
  const shouldShowLoading =
    isLoadingTeachers ||
    (initialSession && isLoadingSessionDetails) ||
    (initialSession && !selectedTrainingSession) ||
    teachers.length === 0 ||
    classrooms.length === 0;

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
        <Typography
          variant="h6"
          fontWeight="900"
          color="#133E65"
          sx={{ fontFamily: "Tajawal" }}
        >
          {initialSession
            ? `تعديل دورة: ${initialSession.title}`
            : `إنشاء دورة ${course ? `لكورس: ${course.title}` : ""}`}
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{ fontFamily: "Tajawal", p: 3, pt: 0, bgcolor: "#F8FAFC" }}
      >
        {shouldShowLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
          >
            <input
              type="hidden"
              {...register("courseId", { valueAsNumber: true })}
            />
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              mb={1}
              color="#133E65"
            >
              معلومات الدورة الأساسية
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="teacherId"
                  control={control}
                  render={({ field }) => (
                    <AuthInput
                      label="المدرس "
                      select
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : ""
                      }
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!errors.teacherId}
                      helperText={errors.teacherId?.message}
                      compact
                    >
                      {teachers.map((inst) => (
                        <MenuItem key={inst.id} value={inst.id}>
                          {inst.firstName} {inst.lastName}
                        </MenuItem>
                      ))}
                    </AuthInput>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="classroomId"
                  control={control}
                  render={({ field }) => (
                    <AuthInput
                      label="القاعة "
                      select
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : ""
                      }
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!errors.classroomId}
                      helperText={errors.classroomId?.message}
                      compact
                    >
                      {classrooms.map((classroom) => (
                        <MenuItem key={classroom.id} value={classroom.id}>
                          {classroom.number}
                        </MenuItem>
                      ))}
                    </AuthInput>
                  )}
                />
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
                  label="عدد المحاضرات *"
                  type="number"
                  placeholder="0"
                  {...register("numberOfLectures", { valueAsNumber: true })}
                  error={!!errors.numberOfLectures}
                  helperText={errors.numberOfLectures?.message}
                  compact
                />
              </Grid>

              {initialSession && (
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <AuthInput
                        label="الحالة *"
                        select
                        value={
                          field.value !== undefined && field.value !== null
                            ? String(field.value)
                            : ""
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                        error={!!errors.status}
                        helperText={errors.status?.message}
                        compact
                      >
                        <MenuItem value="UPCOMING">قيد الانتظار</MenuItem>
                        <MenuItem value="ACTIVE">نشطة</MenuItem>
                        <MenuItem value="COMPLETED">مكتملة</MenuItem>
                      </AuthInput>
                    )}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: initialSession ? 6 : 9 }}>
                <Box sx={{ width: "100%", backgroundColor: "transparent" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                      mb: 0.1,
                      textAlign: "right",
                      fontFamily: "Tajawal",
                      color: "#133E65",
                    }}
                  >
                    التجهيزات المتاحة
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: "10px",
                      minHeight: { xs: "28px", md: "32px" },
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      p: { xs: "2px 5px", md: "3px 5px" },
                      alignItems: "center",
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      backgroundColor: "transparent",
                    }}
                  >
                    {selectedClassroom && selectedClassroom.availableDevices ? (
                      selectedClassroom.availableDevices
                        .split(",")
                        .map((device, index) => {
                          const trimmedDevice = device.trim();
                          if (trimmedDevice) {
                            return (
                              <Chip
                                key={index}
                                label={trimmedDevice}
                                size="small"
                                sx={{
                                  fontFamily: "Tajawal",
                                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                                  height: "24px",
                                }}
                              />
                            );
                          }
                          return null;
                        })
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#9ca3af",
                          fontSize: { xs: "0.7rem", md: "0.75rem" },
                          fontFamily: "Tajawal",
                          py: "4px",
                        }}
                      >
                        الرجاء اختيار قاعة أولاً لعرض التجهيزات...
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      textAlign: "right",
                      fontWeight: "bold",
                      margin: 0,
                      padding: "0 4px 0 0",
                      height: "12px",
                      fontSize: "0.6rem",
                      color: "transparent",
                      mt: 0.1,
                    }}
                  />
                </Box>
              </Grid>
              {initialSession && (
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    mt={1.5}
                    mb={1}
                    color="#133E65"
                  >
                    صورة الدورة
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {(imagePreview || initialSession.image) && (
                      <Box
                        sx={{
                          width: 200,
                          height: 150,
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "2px dashed #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={imagePreview || initialSession.image}
                          alt="Session Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ width: "fit-content" }}
                    >
                      {selectedImageFile ? "تغيير الصورة" : "تحميل صورة"}
                    </Button>
                    {selectedImageFile && (
                      <Button
                        variant="text"
                        color="error"
                        onClick={clearImage}
                        sx={{ width: "fit-content" }}
                      >
                        إزالة الصورة
                      </Button>
                    )}
                    {imageError && (
                      <Typography color="error" variant="caption">
                        {imageError}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>

            <Typography
              variant="subtitle2"
              fontWeight="bold"
              mt={1.5}
              mb={1}
              color="#133E65"
            >
              جدول المحاضرات
            </Typography>
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
                  onChange={(e) =>
                    handleTimeChange("startTime", e.target.value)
                  }
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
                pt: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: "#133E65", whiteSpace: "nowrap" }}
                  >
                    الأيام:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {daysList.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        onClick={() => toggleDay(day)}
                        color={
                          selectedDays.includes(day) ? "primary" : "default"
                        }
                        variant={
                          selectedDays.includes(day) ? "filled" : "outlined"
                        }
                        size="medium"
                        sx={{
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          height: "32px",
                          fontFamily: "Tajawal",
                          fontWeight: "500",
                          px: 0.5,
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
                {errors.daysOfWeek && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ fontSize: "0.6rem", display: "block", mt: 0.2 }}
                  >
                    {errors.daysOfWeek.message}
                  </Typography>
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
                    "&:hover": {
                      bgcolor: "rgba(113, 113, 122, 0.05)",
                      borderColor: "#52525B",
                    },
                    borderRadius: "10px",
                    px: 4,
                    height: "44px",
                    fontSize: "0.95rem",
                    fontFamily: "Tajawal",
                    fontWeight: "bold",
                    minWidth: { xs: "calc(50% - 8px)", sm: "100px" },
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    bgcolor: "#133E65",
                    "&:hover": { bgcolor: "#1e5a91" },
                    "&:disabled": { bgcolor: "#94a3b8" },
                    borderRadius: "10px",
                    px: 3,
                    height: "44px",
                    fontSize: "0.95rem",
                    fontFamily: "Tajawal",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(19, 62, 101, 0.2)",
                    minWidth: { xs: "calc(50% - 8px)", sm: "160px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      minHeight: "44px",
                      whiteSpace: "nowrap",
                      opacity: isLoading ? 0 : 1,
                      transition: "opacity 0.2s ease-in-out",
                    }}
                  >
                    {initialSession ? "حفظ التعديلات" : "إنشاء الدورة"}
                  </Box>
                  {isLoading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        bgcolor: "inherit",
                      }}
                    >
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#fff",
                          fontFamily: "Tajawal",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                        }}
                      >
                        جاري الحفظ...
                      </Typography>
                    </Box>
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionModal;
