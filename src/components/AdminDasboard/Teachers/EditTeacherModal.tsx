import React, { useState, useEffect, memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  Button,
  Slide,
  Box,
  Avatar,
  Zoom,
  CircularProgress,
  Grid,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "../../../Context/SnackbarContext";
import AuthInput from "../../Auth/AuthInput";
import { TeacherApiResponse } from "../../../api/teacherApi";

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
  onSave: (updatedTeacher: TeacherApiResponse) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  open,
  onClose,
  teacher,
  onSave,
}) => {
  const [formData, setFormData] = useState<TeacherApiResponse | null>(teacher);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setFormData(teacher);
      setSuccess(false);
      setLoading(false);
    }
  }, [teacher, open]);

  const handleChange =
    (field: keyof TeacherApiResponse) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) =>
        prev ? { ...prev, [field]: e.target.value } : null,
      );
    };

  const handleSave = () => {
    if (!formData || loading) return;

    setLoading(true);
    
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      setSuccess(true);
      showSnackbar("تم تعديل بيانات المعلم بنجاح", "success");
      setTimeout(onClose, 800);
    }, 1000);
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      dir="rtl"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          bgcolor: "#F8FAFC",
          position: "relative",
          overflow: "visible",
        },
      }}>
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
          تعديل بيانات المعلم
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, pt: 1, overflow: "hidden", bgcolor: "#F8FAFC" }}>
        <Stack spacing={3} alignItems="center">
          <Box sx={{ position: "relative", mb: 1, mt: 2 }}>
            <Avatar
              src={formData.image}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#133E65",
                fontSize: "40px",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.2)",
                border: "4px solid white"
              }}>
              {formData.firstName ? formData.firstName.charAt(0) : ""}
            </Avatar>
          </Box>

          <Stack spacing={2} sx={{ width: "100%", mt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="الاسم الأول"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="الاسم الأخير"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="التخصص"
                  value={formData.specialization}
                  onChange={handleChange("specialization")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange("email")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="اسم المستخدم"
                  value={formData.username || ""}
                  onChange={handleChange("username")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AuthInput
                  label="سنوات الخبرة"
                  value={formData.experienceYears?.toString() || ""}
                  onChange={handleChange("experienceYears")}
                  type="number"
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AuthInput
                  label="العنوان"
                  value={formData.address || ""}
                  onChange={handleChange("address")}
                  compact
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AuthInput
                  label="معلومات الاتصال"
                  value={formData.contactInfo || ""}
                  onChange={handleChange("contactInfo")}
                  compact
                />
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "center", bgcolor: "#F8FAFC" }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          disabled={loading || success}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            bgcolor: success ? "#4caf50" : "#133E65",
            fontSize: "16px",
            fontWeight: "900",
            fontFamily: "Tajawal",
            boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": { 
              bgcolor: success ? "#4caf50" : "#1e5a91",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
            },
          }}
          startIcon={success ? <CheckCircleOutlineIcon /> : <SaveIcon sx={{ ml: 1 }} />}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : success ? (
            "تم الحفظ بنجاح"
          ) : (
            "حفظ التغييرات"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditTeacherModal);
