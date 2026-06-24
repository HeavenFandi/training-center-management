import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Grid,
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "../../components/Auth/AuthInput";
import AuthLayout from "../../components/Auth/AuthLayout";
import Logo from "../../assets/vectors/logo.png";
import {
  InstituteSetupSchema,
  TInstituteSetupType,
} from "../../validation/InstituteSetupSchema";
import { FormSection, GridRow } from "../../components/Forms/FormSection";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/Auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSnackbar } from "../../Context/SnackbarContext";
import actCreateInstitute from "../../store/Institutes/act/actCreateInstitute";

const dayNameMap: Record<string, string> = {
  الأحد: "SUNDAY",
  الاثنين: "MONDAY",
  الثلاثاء: "TUESDAY",
  الأربعاء: "WEDNESDAY",
  الخميس: "THURSDAY",
  الجمعة: "FRIDAY",
  السبت: "SATURDAY",
};

const buildTimeObject = (time?: string) => {
  if (!time) return undefined;
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  return {
    hour,
    minute,
    second: 0,
    nano: 0,
  };
};

const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

const InstituteSetup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { createLoading, createError, createSuccess, createdInstitute } =
    useAppSelector((state) => state.institutes);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TInstituteSetupType>({
    resolver: zodResolver(InstituteSetupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
      phone: "",
      email: "",
      workingHoursMain: [],
      workingHoursMainTimeFrom: "08:00",
      workingHoursMainTimeTo: "15:00",
      workingHoursMainStatus: "open",
    },
  });

  const mainStatus = watch("workingHoursMainStatus");
  const selectedDays = watch("workingHoursMain");

  const toggleDay = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("workingHoursMain", updatedDays, { shouldValidate: true });
  };

  useEffect(() => {
    if (user?.id === undefined || user?.id === null) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (createError) {
      showSnackbar(createError, "error");
    }
  }, [createError, showSnackbar]);

  useEffect(() => {
    if (createSuccess && createdInstitute?.id) {
      showSnackbar("تم حفظ بيانات المعهد بنجاح", "success");
      navigate("/admin-dashboard", { replace: true });
    }
  }, [createSuccess, createdInstitute, navigate, showSnackbar]);

  const handleInstituteSubmit = (data: TInstituteSetupType) => {
    const selectedDaysEnglish = data.workingHoursMain.map(
      (day) => dayNameMap[day] || day,
    );
    const userId = user?.id;

    if (!userId) {
      showSnackbar(
        "تعذر الحصول على هوية المستخدم. يرجى تسجيل الدخول مجدداً.",
        "error",
      );
      return;
    }

    const startTime = buildTimeObject(data.workingHoursMainTimeFrom);
    const endTime = buildTimeObject(data.workingHoursMainTimeTo);

    if (!startTime || !endTime) {
      showSnackbar(
        "وقت بداية أو نهاية غير صالح. يرجى التحقق من القيم وإعادة المحاولة.",
        "error",
      );
      return;
    }

    const payload = {
      userId,
      name: data.name,
      location: data.location,
      description: data.description,
      phoneNumber: data.phone,
      email: data.email,
      startTime,
      endTime,
      workingDays: selectedDaysEnglish,
      status: "ACTIVE" as const,
    };

    console.log("Institute payload:", JSON.stringify(payload, null, 2));

    dispatch(actCreateInstitute(payload));
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <AuthLayout
        sideTitle="إعدادات المعهد"
        sideSubtitle="مرحباً بك في واجهة الإعدادات. يرجى تزويدنا بالمعلومات الأساسية لمعهدك."
      >
        <Box
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "text.secondary",
            zIndex: 1100,
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <IconButton size="small" color="inherit">
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
            اضغط للرجوع
          </Typography>
        </Box>

        <Stack
          alignItems="center"
          spacing={1}
          sx={{ width: "100%", mt: 1, mb: 2 }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{ width: "80px", height: "auto" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              أهلاً بك مرة أخرى
            </Typography>
            <Typography variant="caption" color="text.secondary">
              أدخل معلومات المركز الخاص بك
            </Typography>
          </Box>
        </Stack>

        <Stack component="form" spacing={1} sx={{ width: "100%" }}>
          <FormSection title="المعلومات العامة">
            <Stack spacing={1}>
              <GridRow>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <AuthInput
                    label="اسم المعهد"
                    placeholder="مثلاً: معهد النور التقني"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    compact
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <AuthInput
                    label="وصف المعهد"
                    placeholder="اكتب وصفاً مختصراً..."
                    multiline
                    rows={1}
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    compact
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <AuthInput
                    label="الموقع (العنوان)"
                    placeholder="سوريا - حمص - طريق الشام"
                    {...register("location")}
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    compact
                  />
                </Grid>
              </GridRow>
            </Stack>
          </FormSection>

          <FormSection title="معلومات التواصل">
            <Stack spacing={1}>
              <GridRow>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AuthInput
                    label="رقم الهاتف"
                    placeholder="مثلاً: 0958738337"
                    {...register("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    compact
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <AuthInput
                    label="البريد الإلكتروني"
                    placeholder="example@gmail.com"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    compact
                  />
                </Grid>
              </GridRow>
            </Stack>
          </FormSection>

          <FormSection title="أوقات الدوام">
            <Stack spacing={1}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    mb: 0.5,
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  أيام الدوام
                </Typography>
                <Grid container spacing={0.5}>
                  {days.map((day) => (
                    <Grid size={{ xs: 3, sm: "auto" }} key={day}>
                      <Button
                        fullWidth
                        onClick={() => toggleDay(day)}
                        variant={
                          selectedDays.includes(day) ? "contained" : "outlined"
                        }
                        sx={{
                          borderRadius: "8px",
                          bgcolor: selectedDays.includes(day)
                            ? "#278AD5CC"
                            : "transparent",
                          borderColor: "#D1D5DB",
                          color: selectedDays.includes(day)
                            ? "white"
                            : "#278AD5CC",
                          minWidth: { xs: "auto", sm: "70px" },
                          height: "36px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          "&:hover": {
                            bgcolor: selectedDays.includes(day)
                              ? "#278AD5CC"
                              : "#f0f0f0",
                          },
                        }}
                      >
                        {day}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                {errors.workingHoursMain && (
                  <Typography
                    color="error"
                    sx={{ fontSize: "0.7rem", mt: 0.5 }}
                  >
                    {errors.workingHoursMain.message}
                  </Typography>
                )}
              </Box>

              <GridRow>
                <Grid size={{ xs: 12, sm: mainStatus === "open" ? 4 : 12 }}>
                  <AuthInput
                    label="الحالة"
                    select
                    {...register("workingHoursMainStatus")}
                    error={!!errors.workingHoursMainStatus}
                    compact
                  >
                    <MenuItem value="open">متاح</MenuItem>
                    <MenuItem value="closed">مغلق</MenuItem>
                  </AuthInput>

                {mainStatus === "open" && (
                  <>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <AuthInput
                        label="من"
                        type="time"
                        {...register("workingHoursMainTimeFrom")}
                        error={!!errors.workingHoursMainTimeFrom}
                        compact
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <AuthInput
                        label="إلى"
                        type="time"
                        {...register("workingHoursMainTimeTo")}
                        error={!!errors.workingHoursMainTimeTo}
                        compact
                      />
                    </Grid>
                  </>
                )}
                </Grid>
              </GridRow>
            </Stack>
          </FormSection>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit(handleInstituteSubmit)}
            disabled={createLoading}
            sx={{
              py: 1,
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              boxShadow: "0 8px 16px rgba(5, 22, 48, 0.2)",
              mt: 0.5,
            }}
          >
            {createLoading ? (
              <>
                جاري الحفظ
                <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
              </>
            ) : (
              "حفظ البيانات"
            )}
          </Button>
        </Stack>
      </AuthLayout>
    </Box>
  );
};

export default InstituteSetup;
