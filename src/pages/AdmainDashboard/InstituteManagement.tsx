import React, { useState, useEffect, memo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditInstituteModal from "../../components/AdminDasboard/EditInstituteModal";
import { useSnackbar } from "../../Context/SnackbarContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actGetInstituteByTenantId, actUpdateInstitute, resetInstituteState } from "../../store/Institutes/institutesSlice";

interface InstituteInfo {
  name: string;
  description: string;
  location: string;
  ownerName?: string;
  workingHours: {
    days: string;
    time: string;
    status: string;
  }[];
  contact: {
    phone: string;
    email: string;
  };
  status?: string;
}

const glassCardStyle = {
  borderRadius: "16px",
  bgcolor: "#ffffff",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  p: 3,
  border: "1px solid #f0f4f8",
};

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) => (
  <Paper
    elevation={0}
    sx={{
      ...glassCardStyle,
      p: 2.5,
      display: "flex",
      alignItems: "center",
      gap: 2,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": { 
        transform: "translateY(-2px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)"
      }
    }}
  >
    <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 48, height: 48, borderRadius: "12px" }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight="500" sx={{ fontSize: "0.75rem" }}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="700" color="#0f172a">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const workingDaysMap: Record<string, string> = {
  SUNDAY: "الأحد",
  MONDAY: "الاثنين",
  TUESDAY: "الثلاثاء",
  WEDNESDAY: "الأربعاء",
  THURSDAY: "الخميس",
  FRIDAY: "الجمعة",
  SATURDAY: "السبت",
};

const mapWorkingDay = (day: string) => workingDaysMap[day.toUpperCase()] || day;

const arabicToEnglishDay: Record<string, string> = {
  "الأحد": "SUNDAY",
  "الاثنين": "MONDAY",
  "الثلاثاء": "TUESDAY",
  "الأربعاء": "WEDNESDAY",
  "الخميس": "THURSDAY",
  "الجمعة": "FRIDAY",
  "السبت": "SATURDAY",
};

const formatTime = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const hour = value.hour ?? value.hours ?? value.Hours ?? value.HH ?? "";
    const minute = value.minute ?? value.minutes ?? value.MM ?? "";
    const period = value.period ?? value.ampm ?? value.AMPM ?? value.amPm ?? value.AMPM ?? "";
    const hh = hour !== "" ? String(hour).padStart(2, "0") : "";
    const mm = minute !== "" ? String(minute).padStart(2, "0") : "";
    if (hh || mm) {
      return `${hh}${hh && mm ? ":" : ""}${mm}${period ? ` ${period}` : ""}`.trim();
    }
  }
  return String(value);
};

const InstituteManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { 
    currentInstitute, 
    currentInstituteLoading, 
    currentInstituteError, 
    updateLoading, 
    updateError, 
    updateSuccess 
  } = useAppSelector(
    (state) => state.institutes,
  );
  const [instituteInfo, setInstituteInfo] = useState<InstituteInfo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [missingTenantId, setMissingTenantId] = useState(false);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId");

    if (!tenantId) {
      setMissingTenantId(true);
      return;
    }

    dispatch(actGetInstituteByTenantId(tenantId));
  }, [dispatch]);

  useEffect(() => {
    if (currentInstitute) {
      const timeRange = `${formatTime(currentInstitute.startTime)} - ${formatTime(currentInstitute.endTime)}`;
      const forbiddenDays = ["الجمعة", "السبت", "FRIDAY", "SATURDAY"];
      const mappedDays = (currentInstitute.workingDays ?? []).map((day: string) => mapWorkingDay(day)).filter(day => !forbiddenDays.includes(day));
      setInstituteInfo({
        name: currentInstitute.name ?? "",
        description: currentInstitute.description ?? "",
        location: currentInstitute.location ?? "",
        ownerName: currentInstitute.ownerName ?? undefined,
        status: currentInstitute.status ?? "INACTIVE",
        contact: {
          phone: currentInstitute.phoneNumber ?? "",
          email: currentInstitute.email ?? "",
        },
        // Update workingHours to hold days array, time, and status directly (for compatibility with EditInstituteModal)
        workingHours: [{
          days: mappedDays.join(" - "),
          time: timeRange,
          status: currentInstitute.status ?? "INACTIVE",
        }],
      });
    }
  }, [currentInstitute]);

  useEffect(() => {
    if (missingTenantId) {
      showSnackbar("لم يتم العثور على معرف المؤسسة", "error");
    }
  }, [missingTenantId, showSnackbar]);

  useEffect(() => {
    if (currentInstituteError) {
      showSnackbar(currentInstituteError, "error");
      dispatch(resetInstituteState());
    }
  }, [currentInstituteError, showSnackbar, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      showSnackbar("تم تعديل بيانات المعهد بنجاح", "success");
      dispatch(resetInstituteState());
    }
    if (updateError) {
      showSnackbar(updateError, "error");
      dispatch(resetInstituteState());
    }
  }, [updateSuccess, updateError, showSnackbar, dispatch]);

  const handleUpdate = async (formData: any) => {
    if (!currentInstitute?.id) {
      showSnackbar("لم يتم العثور على معرف المعهد", "error");
      return;
    }

    // Validate required fields
    const requiredFields = [
      formData.name,
      formData.location,
      formData.description,
      formData.phoneNumber,
      formData.email,
      formData.startTime,
      formData.endTime,
      formData.workingDays.length,
      formData.status,
    ];

    if (requiredFields.some(field => !field)) {
      showSnackbar("الرجاء ملء جميع الحقول المطلوبة", "error");
      return;
    }

    const payload = {
      userId: currentInstitute.userId,
      name: formData.name,
      location: formData.location,
      description: formData.description,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      startTime: formData.startTime,
      endTime: formData.endTime,
      workingDays: formData.workingDays.map((day: string) => arabicToEnglishDay[day]),
      status: (formData.status === "متاح" ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
    };

    dispatch(actUpdateInstitute({ id: currentInstitute.id, data: payload }));
  };

  if (missingTenantId) {
    return (
      <Box dir="rtl" sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography variant="h6" color="error.main">
          لم يتم العثور على معرف المؤسسة
        </Typography>
      </Box>
    );
  }

  if (currentInstituteLoading) {
    return (
      <Box dir="rtl" sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography variant="h6" color="text.primary">
          جاري تحميل بيانات المعهد...
        </Typography>
      </Box>
    );
  }

  if (currentInstituteError) {
    return (
      <Box dir="rtl" sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography variant="h6" color="error.main">
          {currentInstituteError}
        </Typography>
      </Box>
    );
  }

  if (!instituteInfo || !currentInstitute) return null;

  return (
    <Box dir="rtl">
 
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={3}
        mb={5}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="h4"
              fontWeight="700"
              color="#0f172a"
              sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
            >
              {instituteInfo.name}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem" }}>
            {instituteInfo.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" sx={{ color: "#0ea5e9" }} />
              <Typography variant="body2" color="text.secondary">
                {instituteInfo.location}
              </Typography>
            </Box>
            {instituteInfo.ownerName && (
              <>
                <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                <Typography variant="body2" color="text.secondary">
                  مالك المعهد: {instituteInfo.ownerName}
                </Typography>
              </>
            )}
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: instituteInfo.status === "ACTIVE" ? "#059669" : "#dc2626",
                fontWeight: 600
              }}
            >
              الحالة: {instituteInfo.status === "ACTIVE" ? "متاح" : "مغلق"}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsEditModalOpen(true)}
          startIcon={<EditIcon />}
          disabled={updateLoading}
          sx={{
            backgroundColor: "#0f172a",
            color: "white",
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            fontWeight: 600,
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
            "&:hover": { 
              backgroundColor: "#1e293b",
              boxShadow: "0 6px 16px rgba(15, 23, 42, 0.2)"
            },
            "&:disabled": {
              backgroundColor: "#94a3b8",
            },
            textTransform: "none"
          }}
        >
          تعديل المعلومات
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={<SchoolIcon />} title="إجمالي الكورسات" value="32 كورس" color="#3b82f6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={<AssignmentIndIcon />} title="المدربين" value="12 مدرب" color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={<PeopleIcon />} title="الطلاب المسجلين" value="450 طالب" color="#10b981" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              ...glassCardStyle,
            }}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 3, color: "#0f172a" }}>
              <ForumIcon sx={{ color: "#0f172a" }} /> قنوات التواصل
            </Typography>
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", color: "#10b981", width: 44, height: 44, borderRadius: "12px" }}>
                  <PhoneIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontSize: "0.8rem" }}>
                    رقم الهاتف المعتمد
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#0f172a" dir="ltr">
                    {instituteInfo.contact.phone}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", width: 44, height: 44, borderRadius: "12px" }}>
                  <EmailIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontSize: "0.8rem" }}>
                    البريد الرسمي
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#0f172a">
                    {instituteInfo.contact.email}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              ...glassCardStyle,
            }}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 3, color: "#0f172a" }}>
              <AccessTimeIcon sx={{ color: "#0f172a" }} /> أوقات الدوام
            </Typography>
            <Stack spacing={1.5}>
              {instituteInfo.workingHours && instituteInfo.workingHours.length > 0 && instituteInfo.workingHours[0].days ? (
                <>
                  <Box
                    sx={{
                      p: 1.8,
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                    }}>
                    <Typography variant="body2" fontWeight="600" color="#0f172a">
                      {instituteInfo.workingHours[0].days}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.8,
                      borderRadius: "12px",
                      bgcolor: "transparent",
                    }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color="#0f172a"
                      dir="ltr">
                      {instituteInfo.workingHours[0].time}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: "#f8fafc",
                  }}>
                  <Typography variant="body2" fontWeight="500" color="#64748b">
                    لا توجد بيانات الدوام
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <EditInstituteModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        initialData={{
          name: currentInstitute.name,
          location: currentInstitute.location,
          description: currentInstitute.description,
          phoneNumber: currentInstitute.phoneNumber,
          email: currentInstitute.email,
          startTime: currentInstitute.startTime,
          endTime: currentInstitute.endTime,
          workingDays: currentInstitute.workingDays,
          status: currentInstitute.status,
        }}
      />
    </Box>
  );
};

export default memo(InstituteManagement);


