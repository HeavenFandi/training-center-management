import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  Button,

  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  InputAdornment,
  Slide,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CreateStudentResponse } from "../../../api/studentApi";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SaveIcon from "@mui/icons-material/Save";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AuthInput from "../../Auth/AuthInput";

import { useAddStudentForm } from "../../../hooks/adminDashboard/useAddStudentForm";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd?: (data: CreateStudentResponse) => void;
}

const AddStudentModal: React.FC<Props> = ({ open, onClose, onAdd }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    imageFile,
    fileInputRef,
    dateInputRef,
    handleImageChange,
    togglePasswordVisibility,
    onSubmit,
    onError,
  } = useAddStudentForm({ onClose, onAdd });

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      dir="rtl"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "25px",
          bgcolor: "#F8FAFC",
          position: "relative",
          overflow: "visible",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 15, right: 15, zIndex: 10 }}
      >
        <CloseIcon sx={{ color: "#334155" }} fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: { xs: 2, md: 3 }, overflow: "hidden" }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center", pt: 2 }}>
              <Typography variant="h6" fontWeight="900" color="#133E65" mb={{ xs: 1, md: 2 }}>
                بيانات الطالب
              </Typography>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={imageFile ? URL.createObjectURL(imageFile) : ""}
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    bgcolor: "#85a3c2",
                    fontSize: { xs: "40px", md: "60px" },
                    boxShadow: "0 15px 35px rgba(133, 163, 194, 0.4)",
                  }}
                >
                  {!imageFile && "👤"}
                </Avatar>
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    left: 5,
                    bgcolor: "#133E65",
                    color: "white",
                    "&:hover": { bgcolor: "#1e5a91" },
                  }}
                  size="small"
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Box>
              <Typography sx={{ mt: { xs: 1, md: 3 }, fontWeight: "800", color: "#133E65" }}>
                {imageFile ? imageFile.name : "الصورة الشخصية"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h6"
                fontWeight="900"
                color="#133E65"
                textAlign="center"
                sx={{ mb: { xs: 2, md: 4 } }}
              >
                إضافة طالب جديد
              </Typography>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="الاسم الأول"
                    placeholder="أحمد"
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="الاسم الاخير"
                    placeholder="علي"
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="اسم المستخدم"
                    placeholder="ahmed_ali"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="example@email.com"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    compact
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="تأكيد كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="معلومات الاتصال"
                    placeholder="09xxxxxxxx"
                    {...register("contactInfo")}
                    error={!!errors.contactInfo}
                    helperText={errors.contactInfo?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="الجنس"
                    select
                    {...register("gender")}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    compact
                  >
                    <MenuItem value="ذكر">ذكر</MenuItem>
                    <MenuItem value="أنثى">أنثى</MenuItem>
                  </AuthInput>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="تاريخ الميلاد"
                    type="date"
                    {...register("birthDate")}
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                    compact
                    inputRef={dateInputRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => dateInputRef.current?.showPicker()}
                            size="small"
                          >
                            <CalendarMonthIcon sx={{ color: "#133E65", fontSize: 18 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="العنوان"
                    placeholder="سوريا، حمص"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <AuthInput
                    label="الاهتمام"
                    placeholder="برمجة، تصميم"
                    {...register("interest")}
                    error={!!errors.interest}
                    helperText={errors.interest?.message}
                    compact
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 8 }}>
                  <AuthInput
                    label="السيرة الذاتية (Bio)"
                    placeholder="أدخل نبذة عنك"
                    {...register("bio")}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                    compact
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  bgcolor: "#133E65",
                  borderRadius: "12px",
                  py: 1.5,
                  fontWeight: "900",
                  "&:hover": { bgcolor: "#1e5a91" },
                  "&:disabled": { bgcolor: "#85a3c2" },
                }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon sx={{ ml: 1 }} />}
              >
                {isSubmitting ? "جاري إضافة الطالب..." : "حفظ بيانات الطالب"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AddStudentModal);


