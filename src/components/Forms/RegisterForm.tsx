import React, { memo } from "react";
import { Box, Button, IconButton, InputAdornment, Stack,  FormControlLabel, Radio, RadioGroup, LinearProgress, TextField, Alert, CircularProgress } from "@mui/material";
import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import useRegisterForm from "../../hooks/auth/useRegisterForm";
import AuthInput from "../Auth/AuthInput";

const RegisterForm = memo(() => {
  const navigate = useNavigate();

  const {
    dateInputRef,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    fileInputRef,
    imageFile,
    handleChooseImage,
    handleImageChange,
    register,
    handleSubmit,
    errors,
    onSubmit,
    uploadProgress,
    isUploading,
    control,
    loading,
    genericError,
  } = useRegisterForm();

  return (
    <>
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: { xs: "static", sm: "absolute" },
          top: { sm: 15, md: 25 },
          left: { sm: 15, md: 25 },
          color: "#50627b",
          alignSelf: "flex-start",
          mb: { xs: 1, sm: 0 },
          "&:hover": { bgcolor: "rgba(80, 98, 123, 0.08)" },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
      </IconButton>

      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={{ xs: 0, sm: 0.5, md: 0.8 }} 
        sx={{ width: "100%", py: { xs: 0.5, md: 1 } }}
      >
        {genericError && (
      <Alert severity="error" sx={{ mb: 1, borderRadius: "10px", border: "1px solid rgba(211, 47, 47, 0.2)", py: 0 }}>
        {genericError}
      </Alert>
    )}

        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            textAlign: "right", 
            mb: { xs: 0.5, md: 1 }, 
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
            color: "#051630"
          }}
        >
          إنشاء حساب جديد
        </Typography>
        
        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="الاسم الأول"
              placeholder="أحمد"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="الاسم الاخير"
              placeholder="علي"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="اسم المستخدم"
              placeholder="ahmed_ali"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="البريد الإلكتروني"
              placeholder="ahmed@gmail.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              compact
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              compact
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="start"
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon
                          sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }}
                        />
                      )}
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
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              compact
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="start"
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlinedIcon
                          sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="تاريخ الميلاد"
              type="date"
              placeholder="1999-01-01"
              {...register("birthDate")}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
              inputRef={dateInputRef}
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="رقم الهاتف"
              placeholder="0912345678"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              compact
            />
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="العنوان"
              placeholder="دمشق، المزة"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              compact
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ width: "100%", mt: { xs: 0.2, md: 0.5 } }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mb: 0.2, textAlign: "right", fontSize: { xs: "0.75rem", md: "0.8rem" } }}
              >
                نبذة عنك (Bio)
              </Typography>
              <TextField
                {...register("bio")}
                fullWidth
                placeholder="أدخل اهتماماتك أو نبذة بسيطة عنك"
                variant="outlined"
                multiline
                rows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "transparent",
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "rgba(19, 62, 101, 0.02)" },
                    "&.Mui-focused": { bgcolor: "white", boxShadow: "0 0 0 4px rgba(19, 62, 101, 0.05)" },
                    minHeight: "32px",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  textAlign: "right",
                  fontWeight: "bold",
                  margin: 0,
                  padding: "0 4px 0 0",
                  height: "12px",
                  fontSize: "0.65rem",
                  color: "#d32f2f",
                  display: "block"
                }}
              >
                {errors.bio ? (errors.bio.message as string) : " "}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 0.5, sm: 1 }} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "right", mb: 0.1, fontSize: { xs: "0.75rem", md: "0.8rem" } }}>
                الجنس
              </Typography>
              <Box
                sx={{
                  height: { xs: "28px", md: "32px" },
                  border: "1px solid",
                  borderColor: errors.gender ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  justifyContent: "space-around",
                  "&:hover": { borderColor: "#212121" }
                }}
              >
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row sx={{ width: "100%", justifyContent: "space-around" }}>
                      <FormControlLabel value="ذكر" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>ذكر</Typography>} sx={{ m: 0 }} />
                      <FormControlLabel value="أنثى" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>أنثى</Typography>} sx={{ m: 0 }} />
                    </RadioGroup>
                  )}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  textAlign: "right",
                  fontWeight: "bold",
                  margin: 0,
                  padding: "0 4px 0 0",
                  height: "12px",
                  fontSize: "0.65rem",
                  color: "#d32f2f",
                  display: "block"
                }}
              >
                {errors.gender ? (errors.gender.message as string) : " "}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mb: 0.1, textAlign: "right", fontSize: { xs: "0.75rem", md: "0.8rem" } }}
              >
                صورة شخصية
              </Typography>
              <Box
                onClick={!isUploading ? handleChooseImage : undefined}
                sx={{
                  width: "100%",
                  height: { xs: "28px", md: "32px" },
                  border: "1px solid",
                  borderColor: errors.profileImage ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: isUploading ? "default" : "pointer",
                  bgcolor: "transparent",
                  "&:hover": { borderColor: "#212121" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <InsertDriveFileOutlinedIcon
                      sx={{ color: "#8b97a8", fontSize: { xs: 14, md: 16 } }}
                    />
                    <Typography variant="body2" color="#8b97a8" sx={{ fontSize: { xs: 10, md: 11 } }}>
                      {isUploading ? "جاري..." : (imageFile ? imageFile.name : "اختر صورة")}
                    </Typography>
                  </Stack>
                </Box>
                {isUploading && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2 }}
                  />
                )}
              </Box>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png"
              />
              {imageFile && !errors.profileImage && (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    margin: 0,
                    padding: "0 4px 0 0",
                    height: "12px",
                    fontSize: "0.65rem",
                    color: "#4caf50",
                    display: "block"
                  }}
                >
                  تم اختيار الصورة بنجاح
                </Typography>
              )}
              {errors.profileImage && (
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: "right",
                    fontWeight: "bold",
                    margin: 0,
                    padding: "0 4px 0 0",
                    height: "12px",
                    fontSize: "0.65rem",
                    color: "#d32f2f",
                    display: "block"
                  }}
                >
                  {errors.profileImage.message as string}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="medium"
          disabled={loading}
          sx={{
            py: { xs: 0.8, md: 1 },
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            boxShadow: "0 8px 16px rgba(19, 62, 101, 0.15)",
            textTransform: "none",
            mt: { xs: 0.2, md: 0.5 },
            bgcolor: "#133E65",
            "&:hover": {
              bgcolor: "#1e5a91",
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "إنشاء حساب"}
        </Button>
      </Stack>
    </>
  );
});

export default RegisterForm;

