import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Container,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useParams } from "react-router-dom";
import {
  coursesData,
  instituteInfo as defaultInstituteInfo,
} from "../../data/coursedata";
import { InstituteCard } from "../../components/Institute/InstituteCard";
import { SidebarInfo } from "../../components/Institute/SidebarInfo";
import { getInstituteById, Institute } from "../../api/instituteApi";

const ALNourInstitute = memo(() => {
  const { id } = useParams();

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setLoading(true);
        setError("");

        const instituteId = id || 1;
        const data = await getInstituteById(instituteId);

        setInstitute(data);
      } catch (error) {
        console.error("Error fetching institute:", error);
        setError("تعذر تحميل بيانات المعهد");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitute();
  }, [id]);

  const displayInfo = useMemo(() => {
    if (institute) {
      return {
        ...defaultInstituteInfo,
        id: institute.id,
        name: institute.name || defaultInstituteInfo.name,
        description: institute.description || defaultInstituteInfo.description,
        location: institute.location || defaultInstituteInfo.location,
        email: institute.email || "",
        contactInfo: institute.contactInfo || "",
        workingHours: [
          {
            days: "الأحد - الخميس",
            hours: institute.workingHours || "08:00-20:00",
          },
          {
            days: "الجمعة - السبت",
            hours: "مغلق",
          },
        ],
        ownerName: institute.ownerName,
        tenantName: institute.tenantName,
      };
    }

    const saved = localStorage.getItem("instituteInfo");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing institute info", e);
      }
    }

    return defaultInstituteInfo;
  }, [institute]);

  const instituteCourses = coursesData.filter((course) => {
    const instituteName = displayInfo?.name || "";

    return (
      course.institute?.includes(instituteName) ||
      course.institute?.includes("النور") ||
      course.institute?.includes("النخبة")
    );
  });

  if (loading) {
    return (
      <Box
        dir="rtl"
        sx={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 100%)",
          minHeight: "100vh",
          pt: { xs: 10, md: 14 },
          pb: { xs: 4, md: 8 },
        }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography fontWeight="700" color="text.secondary">
            جاري تحميل بيانات المعهد...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        dir="rtl"
        sx={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}>
        <Typography
          sx={{
            color: "#C62828",
            bgcolor: "#FFF1F1",
            border: "1px solid #F5B5B5",
            borderRadius: "12px",
            px: 3,
            py: 2,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "Tajawal",
          }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      dir="rtl"
      sx={{
        background: "linear-gradient(135deg, #F8FAFC 0%, #DBEAFE 100%)",
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
      }}>
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 10, md: 12 },
        }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.3fr 0.7fr" },
            gap: 5,
          }}>
          <Box>
            <Box sx={{ mb: 6, textAlign: "right" }}>
              <Typography
                variant="h3"
                fontWeight="900"
                sx={{ color: "#1E293B", mb: 2 }}>
                {displayInfo.name}
              </Typography>

              <Typography
                sx={{
                  color: "#475569",
                  lineHeight: 1.9,
                  fontSize: "1.1rem",
                }}>
                {displayInfo.description}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight="800"
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}>
              <SchoolIcon color="primary" />
              الدورات التدريبية المتاحة
            </Typography>

            <Stack spacing={2}>
              {instituteCourses.length > 0 ? (
                instituteCourses.map((course) => (
                  <InstituteCard key={course.id} course={course} />
                ))
              ) : (
                <Typography
                  sx={{
                    color: "#64748B",
                    bgcolor: "rgba(255,255,255,0.7)",
                    borderRadius: "12px",
                    p: 2,
                    textAlign: "center",
                    fontWeight: 700,
                  }}>
                  لا توجد دورات متاحة حاليًا لهذا المعهد
                </Typography>
              )}
            </Stack>
          </Box>

          <SidebarInfo info={displayInfo} />
        </Box>
      </Container>
    </Box>
  );
});

export default ALNourInstitute;
