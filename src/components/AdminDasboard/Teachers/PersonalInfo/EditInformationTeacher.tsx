import React, { useState, memo, useCallback } from "react";
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
  onSave: (updatedTeacher: TeacherFormData) => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  open,
  onClose,
  teacher,
  onSave,
}) => {
  const [formData, setFormData] = useState<TeacherFormData | null>(teacher);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange =
    (field: keyof TeacherFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) =>
        prev ? { ...prev, [field]: e.target.value } : null,
      );
    };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => (prev ? { ...prev, image: imageUrl } : null));
  };

  const handleSave = useCallback(() => {
    if (!formData || loading) return;

    setLoading(true);

    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    }, 1200);
  }, [formData, loading, onSave, onClose]);

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
            <EditTeacherForm formData={formData} onChange={handleChange} />
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
          }}>
          {loading ? "جارٍ الحفظ..." : success ? "تم الحفظ" : "حفظ التعديلات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditTeacherModal);
