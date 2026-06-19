import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Grid,
  IconButton,
  Typography,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AuthInput from "../Auth/AuthInput";

interface FormData {
  name: string;
  location: string;
  description: string;
  phoneNumber: string;
  email: string;
  startTime: string;
  endTime: string;
  workingDays: string[];
  status: string;
}

interface EditInstituteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  initialData: {
    name: string;
    location: string;
    description: string;
    phoneNumber: string;
    email: string;
    startTime: string;
    endTime: string;
    workingDays: string[];
    status: string;
  };
}

const arabicDaysList = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

const arabicToEnglishDay: Record<string, string> = {
  "الأحد": "SUNDAY",
  "الاثنين": "MONDAY",
  "الثلاثاء": "TUESDAY",
  "الأربعاء": "WEDNESDAY",
  "الخميس": "THURSDAY",
  "الجمعة": "FRIDAY",
  "السبت": "SATURDAY",
};

const englishToArabicDay: Record<string, string> = {
  "SUNDAY": "الأحد",
  "MONDAY": "الاثنين",
  "TUESDAY": "الثلاثاء",
  "WEDNESDAY": "الأربعاء",
  "THURSDAY": "الخميس",
  "FRIDAY": "الجمعة",
  "SATURDAY": "السبت",
};

const formatTime = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const hour = value.hour ?? value.hours ?? value.Hours ?? value.HH ?? "";
    const minute = value.minute ?? value.minutes ?? value.MM ?? "";
    const period = value.period ?? value.ampm ?? value.AMPM ?? value.amPm ?? "";
    const hh = hour !== "" ? String(hour).padStart(2, "0") : "";
    const mm = minute !== "" ? String(minute).padStart(2, "0") : "";
    if (hh || mm) {
      return `${hh}${hh && mm ? ":" : ""}${mm}${period ? ` ${period}` : ""}`.trim();
    }
  }
  return String(value);
};

const EditInstituteModal: React.FC<EditInstituteModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const forbiddenDays = ["الجمعة", "السبت", "FRIDAY", "SATURDAY"];
  
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name || "",
    location: initialData.location || "",
    description: initialData.description || "",
    phoneNumber: initialData.phoneNumber || "",
    email: initialData.email || "",
    startTime: formatTime(initialData.startTime),
    endTime: formatTime(initialData.endTime),
    workingDays: (initialData.workingDays || []).map(day => 
      englishToArabicDay[day] || day
    ).filter(day => !forbiddenDays.includes(day)),
    status: initialData.status === "ACTIVE" ? "متاح" : "مغلق",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData.name || "",
        location: initialData.location || "",
        description: initialData.description || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || "",
        startTime: formatTime(initialData.startTime),
        endTime: formatTime(initialData.endTime),
        workingDays: (initialData.workingDays || []).map(day => 
          englishToArabicDay[day] || day
        ).filter(day => !forbiddenDays.includes(day)),
        status: initialData.status === "ACTIVE" ? "متاح" : "مغلق",
      });
    }
  }, [initialData, open]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleWorkingDaysChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      workingDays: typeof value === "string" ? value.split(",") : value,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="rtl"
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: "#F8FAFC",
          p: 0.5,
        },
      }}>
      <Box
        sx={{
          p: 1.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#F8FAFC",
        }}>
        <Typography
          variant="subtitle1"
          fontWeight="900"
          color="#133E65"
          sx={{ fontFamily: "Tajawal" }}>
          تعديل بيانات المعهد
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff", p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ 
        p: 2, 
        px: 3, 
        pt: 0, 
        bgcolor: "#F8FAFC",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="اسم المعهد"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="الموقع"
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, location: e.target.value })
              }
              compact
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AuthInput
              label="وصف المعهد"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              compact
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="رقم الهاتف"
              value={formData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AuthInput
              label="البريد الإلكتروني"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, email: e.target.value })
              }
              compact
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <AuthInput
              label="وقت البدء"
              value={formData.startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              placeholder="مثلاً: 08:00 AM"
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <AuthInput
              label="وقت الانتهاء"
              value={formData.endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              placeholder="مثلاً: 03:00 PM"
              compact
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <AuthInput
              label="الحالة"
              select
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, status: e.target.value })
              }
              compact>
              <MenuItem value="متاح">متاح</MenuItem>
              <MenuItem value="مغلق">مغلق</MenuItem>
            </AuthInput>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="working-days-label" sx={{ fontFamily: "Tajawal" }}>أيام العمل</InputLabel>
              <Select
                labelId="working-days-label"
                multiple
                value={formData.workingDays}
                onChange={handleWorkingDaysChange}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                label="أيام العمل"
              >
                {arabicDaysList.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={formData.workingDays.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            startIcon={<SaveIcon sx={{ ml: 1 }} />}
            sx={{
              backgroundColor: "#091c39",
              color: "white",
              borderRadius: "50px",
              py: 1.2,
              fontWeight: "bold",
              fontSize: "1rem",
              fontFamily: "Tajawal",
              boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#0d2d4a",
                transform: "translateY(-2px)",
                boxShadow: "0px 10px 25px rgba(19, 62, 101, 0.3)",
              },
            }}>
            حفظ التعديلات
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditInstituteModal;


