import React from "react";
import { Dialog, DialogContent, Stack, Button, Box, Typography, IconButton } from "@mui/material";
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
          {editingLecture ? "تعديل جلسة" : "إضافة جلسة جديدة"}
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Tajawal", p: 4, pt: 2, bgcolor: "#F8FAFC" }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <AuthInput
            label="اسم الجلسة"
            placeholder="أدخل اسم الجلسة"
            value={lectureTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureTitle(e.target.value)}
            compact
          />
          <AuthInput
            label="تاريخ الجلسة"
            type="date"
            value={lectureDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureDate(e.target.value)}
            compact
          />
          <Stack direction="row" spacing={2} gap={2}>
            <AuthInput
              label="بداية الجلسة"
              type="time"
              value={lectureStartTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLectureStartTime(e.target.value)}
              compact
            />
            <AuthInput
              label="نهاية الجلسة"
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
              }
            }}
            startIcon={<SaveIcon sx={{ ml: 1 }} />}
          >
            {editingLecture ? "حفظ التعديلات" : "إضافة الجلسة"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(LectureDialog);


