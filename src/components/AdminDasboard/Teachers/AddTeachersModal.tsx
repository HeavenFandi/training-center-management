import React, { memo, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  InputAdornment,
} from "@mui/material";

import { TeacherFormData } from "../../../validation/TeacherSchema";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AuthInput from "../../Auth/AuthInput";

import { useAddTeacherForm } from "../../../hooks/adminDashboard/useAddTeacherForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: TeacherFormData & { cvFile: File | null }) => void;
}

const AddTeachersModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    cvFile,
    fileInputRef,
    togglePasswordVisibility,
    handleFileChange,
    onSubmit,
    onError,
  } = useAddTeacherForm({ onClose, onSave });

  const uploadBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    bgcolor: "rgba(19, 62, 101, 0.05)",
    color: "#133E65",
    borderRadius: "12px",
    p: 1.5,
    cursor: "pointer",
    mt: 1,
    border: "1px dashed rgba(19, 62, 101, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": { bgcolor: "rgba(19, 62, 101, 0.1)" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: "#F8FAFC",
          overflow: "hidden",
          p: 0.5,
        },
      }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{ direction: "rtl" }}>
        <Box
          sx={{
            p: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#F8FAFC",
          }}>
          <Typography
            variant="h6"
            fontWeight="900"
            color="#133E65"
            sx={{ fontFamily: "Tajawal" }}>
            إضافة معلم جديد
          </Typography>
          <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }} type="button">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4, pt: 1, bgcolor: "#F8FAFC" }}>
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
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
                label="الاسم الأخير"
                placeholder="علي"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="اسم المستخدم"
                placeholder="ahmed_ali"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="البريد الالكتروني"
                placeholder="ahmad@gmail.com"
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
                placeholder="••••••"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                compact
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        size="small">
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <AuthInput
                label="التخصص"
                placeholder="هندسة برمجيات"
                {...register("specialization")}
                error={!!errors.specialization}
                helperText={errors.specialization?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 4 }}>
              <AuthInput
                label="رقم الهاتف"
                placeholder="09478836"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <AuthInput
                label="سنوات الخبرة"
                placeholder="5"
                {...register("experience")}
                error={!!errors.experience}
                helperText={errors.experience?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <AuthInput
                label="العنوان"
                placeholder="دمشق، المزة"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
                compact
              />
            </Grid>
          </Grid>

          <Box
            sx={uploadBoxStyle}
            mt={1}
            onClick={() => fileInputRef.current?.click()}>
            <Typography fontSize={14} fontWeight="800">
              {cvFile ? cvFile.name : "رفع السيرة الذاتية (اختياري)"}
            </Typography>
            <CloudUploadIcon fontSize="small" />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              bgcolor: "#133E65",
              color: "white",
              fontWeight: "900",
              borderRadius: "12px",
              py: 1.5,
              fontSize: "1rem",
              fontFamily: "Tajawal",
              boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#1e5a91",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
              },
            }}
            startIcon={<SaveIcon sx={{ ml: 1 }} />}>
            {isSubmitting ? "جاري الإضافة..." : "إضافة المعلم"}
          </Button>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default memo(AddTeachersModal);


