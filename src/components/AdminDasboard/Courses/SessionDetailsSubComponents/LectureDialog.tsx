import React from "react";
import { Dialog, DialogContent, Stack, Button, Box, Typography, IconButton, CircularProgress, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { TLecture } from "../../../../types/cardType";
import AuthInput from "../../../Auth/AuthInput";

interface LectureDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editingLecture: TLecture | null;
  lectureTitle: string;
  setLectureTitle: (val: string) => void;
  lectureDate: string;
  setLectureDate: (val: string) => void;
  lectureStartTime: string;
  setLectureStartTime: (val: string) => void;
  lectureEndTime: string;
  setLectureEndTime: (val: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const LectureDialog: React.FC<LectureDialogProps> = ({
  open,
  onClose,
  onSave,
  editingLecture,
  lectureTitle,
  setLectureTitle,
  lectureDate,
  setLectureDate,
  lectureStartTime,
  setLectureStartTime,
  lectureEndTime,
  setLectureEndTime,
  isLoading = false,
  errorMessage = null,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      dir="rtl"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 0.5,
          backgroundColor: "#F8FAFC",
        }
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
        <Typography variant="h6" fontWeight="900" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
          {editingLecture ? "تعديل محاضرة" : "إضافة محاضرة جديدة"}
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Tajawal", p: 4, pt: 2, bgcolor: "#F8FAFC" }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <AuthInput
            label="اسم المحاضرة"
            placeholder="أدخل اسم المحاضرة"
            value={lectureTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureTitle(e.target.value)}
            compact
          />
          <AuthInput
            label="تاريخ المحاضرة"
            type="date"
            value={lectureDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureDate(e.target.value)}
            compact
          />
          <Stack direction="row" spacing={2} gap={2}>
            <AuthInput
              label="بداية المحاضرة"
              type="time"
              value={lectureStartTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureStartTime(e.target.value)}
              compact
            />
            <AuthInput
              label="نهاية المحاضرة"
              type="time"
              value={lectureEndTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureEndTime(e.target.value)}
              compact
            />
          </Stack>
        </Stack>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            onClick={onSave}
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: "#133E65",
              borderRadius: "12px",
              py: 1.5,
              fontWeight: "900",
              fontSize: "1rem",
              fontFamily: "Tajawal",
              boxShadow: "0 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": { 
                backgroundColor: "#1e5a91",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(19, 62, 101, 0.3)",
              },
              "&:disabled": {
                backgroundColor: "#94a3b8",
              }
            }}
            startIcon={!isLoading ? <SaveIcon sx={{ ml: 1 }} /> : <CircularProgress size={20} sx={{ color: "#fff", ml: 1 }} />}
          >
            {isLoading ? "جارٍ الحفظ..." : (editingLecture ? "حفظ التعديلات" : "إضافة المحاضرة")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(LectureDialog);


