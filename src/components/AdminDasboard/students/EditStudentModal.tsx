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
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { CreateStudentResponse } from "../../../api/studentApi";
import EditStudentForm from "./EditStudentForm";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});

interface EditStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: (CreateStudentResponse | {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    contactInfo?: string;
    gender?: string;
    birthDate?: string;
    address?: string;
    interest?: string;
    bio?: string;
    enrollmentDate?: string;
    image?: string;
    userId?: number;
  }) | null;
  onSave: (updatedStudent: any) => void;
  onImageUpdate?: () => Promise<void>;
  loading?: boolean;
  success?: boolean;
  error?: string | null;
  setPendingImageFile?: (file: File | null) => void;
  imageUpdateLoading?: boolean;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  open,
  onClose,
  student,
  onSave,
  onImageUpdate,
  loading = false,
  success = false,
  error = null,
  setPendingImageFile,
  imageUpdateLoading = false,
}) => {
  const [formData, setFormData] = useState<any>(student);
  const [tempImageUrl, setTempImageUrl] = useState<string | undefined>(student?.image);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (open && student) {
      console.log("[DEBUG EditStudentModal] === Opening edit modal ===");
      console.log("[DEBUG EditStudentModal] Initial student.bio:", student?.bio);
      setFormData({ ...student }); // Make a copy
      setTempImageUrl(student?.image);
      setValidationError(null);
    }
  }, [student, open]);

  // Update tempImageUrl when student's image changes
  useEffect(() => {
    if (student?.image) {
      setTempImageUrl(student.image);
    }
  }, [student?.image]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: e.target.value } : null));
  };

  const handleImageChange = (imageUrl: string, file?: File) => {
    setTempImageUrl(imageUrl);
    if (file && setPendingImageFile) {
      setPendingImageFile(file);
    }
  };

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          setValidationError("الصورة يجب أن تكون من نوع JPG أو PNG");
          return;
        }
        
        // Validate file size
        if (file.size > MAX_IMAGE_SIZE) {
          setValidationError("الصورة يجب أن تكون أقل من 5 ميجابايت");
          return;
        }
        
        setValidationError(null);
        const imageUrl = URL.createObjectURL(file);
        handleImageChange(imageUrl, file);
      }
    },
    [setPendingImageFile]
  );

  const handleSave = useCallback(async () => {
    console.log("[DEBUG EditStudentModal] Save clicked!");
    console.log("[DEBUG EditStudentModal] formData:", formData);
    console.log("[DEBUG EditStudentModal] formData.bio:", formData?.bio);
    console.log("[DEBUG EditStudentModal] loading:", loading);
    console.log("[DEBUG EditStudentModal] imageUpdateLoading:", imageUpdateLoading);

    if (!formData || loading || imageUpdateLoading) {
      console.log("[DEBUG EditStudentModal] Not saving: formData missing or loading");
      return;
    }

    // Validate required fields
    const errors: string[] = [];
    if (!formData.firstName?.trim()) errors.push("الاسم الأول مطلوب");
    if (!formData.lastName?.trim()) errors.push("الاسم الأخير مطلوب");
    if (!formData.username?.trim()) errors.push("اسم المستخدم مطلوب");
    if (!formData.gender) errors.push("الجنس مطلوب");
    if (!formData.birthDate) errors.push("تاريخ الميلاد مطلوب");
    if (!formData.address?.trim()) errors.push("العنوان مطلوب");
    if (!formData.bio?.trim()) errors.push("السيرة الذاتية مطلوبة");

    if (errors.length > 0) {
      setValidationError(errors[0]);
      return;
    }

    setValidationError(null);

    // First update image if there's a pending file
    if (onImageUpdate) {
      try {
        await onImageUpdate();
      } catch (err) {
        console.error("[DEBUG EditStudentModal] Image update failed:", err);
      }
    }

    if (formData) {
      console.log("[DEBUG EditStudentModal] Passing complete formData to onSave:", formData);
      onSave(formData);
    }
  }, [formData, loading, onSave, onImageUpdate, imageUpdateLoading]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
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
          تعديل البيانات الشخصية
        </Typography>
        <IconButton onClick={onClose} disabled={loading} sx={{ bgcolor: "#fff" }}>
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
            <EditStudentForm formData={formData} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} order={{ xs: 1, md: 2 }} sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={tempImageUrl}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
                  border: "4px solid #fff",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  bgcolor: "#133E65",
                  color: "white",
                  "&:hover": { bgcolor: "#0d2b4a" },
                  width: 40,
                  height: 40,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageFileChange}
                />
                <SaveIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: "space-between", bgcolor: "#F8FAFC" }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: "#64748b", fontWeight: "bold", fontFamily: "Tajawal" }}
        >
          إلغاء
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || imageUpdateLoading || success}
            sx={{
              fontWeight: "900",
              minWidth: "160px",
              bgcolor: success ? "#4caf50" : "#133E65",
              px: 5,
              py: 1.5,
              borderRadius: "12px",
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
            {loading || imageUpdateLoading ? (
              ""
            ) : success ? (
              "تم الحفظ بنجاح"
            ) : (
              "حفظ التغييرات"
            )}
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

export default memo(EditStudentModal);
