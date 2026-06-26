import React, { useState, useEffect, memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Slide,
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TeacherApiResponse } from "../../../api/teacherApi";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeacherSchema, EditTeacherFormData } from "../../../validation/TeacherSchema";
import AuthInput from "../../Auth/AuthInput";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

interface EditTeacherModalProps {
  open: boolean;
  onClose: () => void;
  teacher: TeacherApiResponse | null;
  onSave: (formData: EditTeacherFormData) => void;
  onImageUpdate?: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  setPendingImageFile?: (file: File | null) => void;
  imageUpdateLoading?: boolean;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  open,
  onClose,
  teacher,
  onSave,
  onImageUpdate,
  loading = false,
  error = null,
  setPendingImageFile,
  imageUpdateLoading = false,
}) => {
  const [tempImageUrl, setTempImageUrl] = useState<string | undefined>(teacher?.image ?? undefined);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditTeacherFormData>({
    resolver: zodResolver(editTeacherSchema) as any,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      specialization: "",
      certificates: "",
      address: "",
      cv: "",
      experienceYears: 0,
    },
  });

  useEffect(() => {
    if (open && teacher) {
      setValue("firstName", teacher.firstName || "");
      setValue("lastName", teacher.lastName || "");
      setValue("username", teacher.username || "");
      setValue("email", teacher.email || "");
      setValue("phone", teacher.contactInfo || "");
      setValue("specialization", teacher.specialization || "");
      setValue("certificates", teacher.certificates || "");
      setValue("address", teacher.address || "");
      setValue("cv", teacher.cv || "");
      setValue("experienceYears", teacher.experienceYears || 0);
      setTempImageUrl(teacher.image ?? undefined);
      setValidationError(null);
    }
  }, [teacher, open, setValue]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Validate image type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          setValidationError("الصورة يجب أن تكون من نوع JPG أو PNG أو WEBP");
          return;
        }

        // Validate max size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setValidationError("الصورة يجب أن تكون أقل من 5 ميجابايت");
          return;
        }

        setValidationError(null);
        const imageUrl = URL.createObjectURL(file);
        setTempImageUrl(imageUrl);
        if (setPendingImageFile) {
          setPendingImageFile(file);
        }
      }
    },
    [setPendingImageFile],
  );

  const onSubmit = useCallback(
    (formData: EditTeacherFormData) => {
      console.log("[DEBUG EditTeacherModal] onSubmit called with formData:", formData);
      setValidationError(null);
      onSave(formData);
    },
    [onSave],
  );

  const onError = useCallback((errors: FieldErrors<EditTeacherFormData>) => {
    console.log("Form validation errors:", errors);
    setValidationError("يرجى التأكد من ملء جميع الحقول بشكل صحيح");
  }, []);

  return (
    <Dialog
      open={open}
      onClose={loading || imageUpdateLoading ? undefined : onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
      dir="rtl"
      PaperProps={{
        sx: { borderRadius: "28px", p: 0.5 },
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
        <Typography variant="h6" fontWeight="900" color="#133E65">
          تعديل بيانات المعلم
        </Typography>
        <IconButton onClick={onClose} disabled={loading || imageUpdateLoading} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, pt: 2, overflowY: "auto", bgcolor: "#F8FAFC" }}>
        {(error || validationError) && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "#fee2e2", borderRadius: "12px", border: "1px solid #fecaca" }}>
            <Typography sx={{ color: "#dc2626", fontFamily: "Tajawal", fontWeight: "bold" }}>
              {validationError || error}
            </Typography>
          </Box>
        )}
        <Grid container spacing={4} alignItems="flex-start" sx={{ flexDirection: "row-reverse" }}>
          <Grid size={{ xs: 12, md: 9 }} order={{ xs: 2, md: 1 }}>
            <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="الاسم الأول"
                  placeholder="أدخل الاسم الأول"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="الاسم الأخير"
                  placeholder="أدخل الاسم الأخير"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  compact
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="اسم المستخدم"
                  placeholder="أدخل اسم المستخدم"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="البريد الإلكتروني"
                  placeholder="أدخل البريد الإلكتروني"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  compact
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="كلمة المرور (اختياري)"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور الجديدة"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  compact
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} size="small">
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="تأكيد كلمة المرور"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="تأكيد كلمة المرور"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  compact
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility} size="small">
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="رقم الهاتف"
                  placeholder="أدخل رقم الهاتف"
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="التخصص"
                  placeholder="أدخل التخصص"
                  {...register("specialization")}
                  error={!!errors.specialization}
                  helperText={errors.specialization?.message}
                  compact
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="الشهادات"
                  placeholder="أدخل الشهادات"
                  {...register("certificates")}
                  error={!!errors.certificates}
                  helperText={errors.certificates?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="سنوات الخبرة"
                  placeholder="أدخل سنوات الخبرة"
                  type="number"
                  {...register("experienceYears")}
                  error={!!errors.experienceYears}
                  helperText={errors.experienceYears?.message}
                  compact
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <AuthInput
                  label="العنوان"
                  placeholder="أدخل العنوان"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AuthInput
                  label="السيرة الذاتية"
                  placeholder="أدخل السيرة الذاتية"
                  {...register("cv")}
                  error={!!errors.cv}
                  helperText={errors.cv?.message}
                  compact
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} order={{ xs: 1, md: 2 }} sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={tempImageUrl || ""}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  border: "4px solid white",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  bgcolor: "#133E65",
                  color: "white",
                  "&:hover": { bgcolor: "#0d2d4a" },
                }}
                disabled={loading || imageUpdateLoading}
              >
                <SaveIcon />
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  hidden
                  onChange={handleImageFileChange}
                />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "space-between", bgcolor: "#F8FAFC" }}>
        <Button
          onClick={onClose}
          disabled={loading || imageUpdateLoading}
          sx={{ color: "#64748b", fontWeight: "bold", fontFamily: "Tajawal" }}
        >
          إلغاء
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handleSubmit(onSubmit, onError)}
            variant="contained"
            disabled={loading || imageUpdateLoading}
            sx={{
              fontWeight: "900",
              minWidth: "160px",
              bgcolor: "#133E65",
              px: 5,
              py: 1.5,
              borderRadius: "12px",
              fontFamily: "Tajawal",
              boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#1e5a91",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
              },
            }}
            startIcon={<SaveIcon sx={{ ml: 1 }} />}
          >
            {loading || imageUpdateLoading ? "" : "حفظ التعديلات"}
          </Button>
          {(loading || imageUpdateLoading) && (
            <CircularProgress
              size={24}
              sx={{
                color: "#fff",
                position: "absolute",
                top: "50%",
                left: "50%",
                mt: "-12px",
                ml: "-12px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditTeacherModal);
