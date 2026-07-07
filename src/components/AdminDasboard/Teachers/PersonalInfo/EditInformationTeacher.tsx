import React, { useState, useEffect, memo } from "react";
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
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import TeacherImageUpload from "./TeacherImageUpload";
import EditTeacherForm from "./EditTeacherForm";
import { useSnackbar } from "../../../../Context/SnackbarContext";

export type TeacherFormData = {
  fname: string;
  lname: string;
  specialty: string;
  teacherCode: string;
  status: string;
  city: string;
  experience: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  courses?: any[];
};

export type TeacherFormErrors = Partial<Record<keyof TeacherFormData, string>>;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

interface EditTeacherModalProps {
  open: boolean;
  onClose: () => void;
  teacher: TeacherFormData | null;
  onSave: (updatedTeacher: TeacherFormData, imageFile?: File | null) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  open,
  onClose,
  teacher,
  onSave,
}) => {
  const [formData, setFormData] = useState<TeacherFormData | null>(teacher);
  const [errors, setErrors] = useState<TeacherFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setFormData(teacher);
      setErrors({});
      setSuccess(false);
    }
  }, [teacher, open]);

  const validate = () => {
    const newErrors: TeacherFormErrors = {};

    if (!formData) return false;

    if (!formData.fname.trim()) {
      newErrors.fname = "الاسم الأول مطلوب";
    }

    if (!formData.lname.trim()) {
      newErrors.lname = "الاسم الأخير مطلوب";
    }

    if (!formData.username.trim()) {
      newErrors.username = "اسم المستخدم مطلوب";
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = "التخصص مطلوب";
    }

    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "سنوات الخبرة مطلوبة";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "السيرة الذاتية مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof TeacherFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) =>
        prev ? { ...prev, [field]: e.target.value } : null,
      );

      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (file: File, preview: string) => {
    setSelectedImage(file);

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            image: preview,
          }
        : null,
    );
  };

  const handleSave = () => {
    if (!formData || loading) return;

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      onSave(formData, selectedImage);
      setLoading(false);
      setSuccess(true);
      showSnackbar("تم تعديل المعلومات بنجاح", "success");

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    }, 700);
  };
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 0.5,
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
        }}>
        <Typography variant="h6" fontWeight="900" color="#133E65">
          تعديل معلومات المعلم
        </Typography>

        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{ p: 4, pt: 2, overflowY: "auto", bgcolor: "#F8FAFC" }}>
        <Grid
          container
          spacing={4}
          alignItems="flex-start"
          sx={{ flexDirection: "row-reverse" }}>
          <Grid size={{ xs: 12, md: 9 }} order={{ xs: 2, md: 1 }}>
            <EditTeacherForm
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 3 }}
            order={{ xs: 1, md: 2 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 2,
            }}>
            <TeacherImageUpload
              image={formData?.image}
              onImageChange={handleImageChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          justifyContent: "space-between",
          bgcolor: "#F8FAFC",
        }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#6B7280",
            fontWeight: "bold",
            borderRadius: "14px",
            px: 3,
          }}>
          إلغاء
        </Button>

        <Button
          onClick={handleSave}
          disabled={loading || success}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : success ? (
              <CheckCircleOutlineIcon />
            ) : (
              <SaveIcon />
            )
          }
          variant="contained"
          sx={{
            bgcolor: success ? "#10B981" : "#133E65",
            px: 4,
            py: 1.2,
            borderRadius: "14px",
            fontWeight: "bold",
            boxShadow: "0px 8px 20px rgba(19,62,101,0.2)",
            "&:hover": {
              bgcolor: success ? "#10B981" : "#0F2F4D",
            },
            "& .MuiButton-startIcon": {
              marginLeft: "8px",
              marginRight: 0,
            },
          }}>
          {loading ? "جارٍ الحفظ..." : success ? "تم الحفظ" : "حفظ التعديلات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditTeacherModal);
