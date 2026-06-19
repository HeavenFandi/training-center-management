import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TeacherApiResponse } from "../../../api/teacherApi";

interface TeacherDetailsModalProps {
  open: boolean;
  teacher: TeacherApiResponse | null;
  loading?: "idle" | "pending" | "succeeded" | "failed";
  onClose: () => void;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({
  open,
  teacher,
  loading,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "right" }}>
          تفاصيل المعلم
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading === "pending" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              جار تحميل بيانات المعلم...
            </Typography>
          </Box>
        ) : teacher ? (
          <Stack spacing={2} sx={{ textAlign: "right", mt: 1 }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Avatar
                src={teacher.image}
                sx={{ width: 100, height: 100, fontSize: 40, fontWeight: 700 }}
              >
                {teacher.firstName ? teacher.firstName.charAt(0) : ""}
              </Avatar>
            </Stack>

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              {teacher.firstName} {teacher.lastName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ bgcolor: "#f8fafc", p: 2, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    الاسم الأول
                  </Typography>
                  <Typography variant="body1">{teacher.firstName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    الاسم الأخير
                  </Typography>
                  <Typography variant="body1">{teacher.lastName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    التخصص
                  </Typography>
                  <Typography variant="body1">{teacher.specialization}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    الشهادات
                  </Typography>
                  <Typography variant="body1">{teacher.certificates || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    العنوان
                  </Typography>
                  <Typography variant="body1">{teacher.address || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    السيرة الذاتية
                  </Typography>
                  <Typography variant="body1">{teacher.cv || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    سنوات الخبرة
                  </Typography>
                  <Typography variant="body1">{teacher.experienceYears || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    اسم المستخدم
                  </Typography>
                  <Typography variant="body1">{teacher.username || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    البريد الإلكتروني
                  </Typography>
                  <Typography variant="body1">{teacher.email || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    معلومات الاتصال
                  </Typography>
                  <Typography variant="body1">{teacher.contactInfo || "---"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    عدد الطلاب
                  </Typography>
                  <Typography variant="body1">{teacher.numberOfStudents || 0}</Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDetailsModal;
