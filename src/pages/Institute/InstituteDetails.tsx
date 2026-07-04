import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InstituteCard } from "../../components/Institute/InstituteCard";
import { SidebarInfo } from "../../components/Institute/SidebarInfo";
import { getInstituteById, Institute } from "../../api/instituteApi";
import { getCoursesByTenantId } from "../../api/courseApi";
import { TCourse } from "../../types/cardType";
import { RootState, AppDispatch } from "../../store";
import { actGetActiveOrUpcomingByCourseAndInstitute } from "../../store/Courses/trainingSessionsSlice";

const InstituteDetails = memo(() => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const courseSessions = useSelector((state: RootState) => state.trainingSessions.courseSessions);
  const courseSessionsLoading = useSelector((state: RootState) => state.trainingSessions.courseSessionsLoading);
  const courseSessionsError = useSelector((state: RootState) => state.trainingSessions.courseSessionsError);

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setLoading(true);
        setError("");

        const instituteId = id || 1;
        const data = await getInstituteById(instituteId);

        setInstitute(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching institute:", error);
        }
        setError("تعذر تحميل بيانات المعهد");
      } finally {
        setLoading(false);
      }
    };

    fetchInstitute();
  }, [id]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!institute?.tenantId) return;
      
      try {
        setCoursesLoading(true);
        const coursesData = await getCoursesByTenantId(String(institute.tenantId));
        setCourses(coursesData);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching courses:", error);
        }
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [institute?.tenantId]);

  const formatTime = (time: string | { hour: number; minute: number } | undefined) => {
    if (!time) return "00:00";
    if (typeof time === "string") return time;
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  };

  const displayInfo = useMemo(() => {
    if (institute) {
      const workingHoursList: { days: string; time: string }[] = [];
      
      if (institute.workingDays && institute.workingDays.length > 0) {
        workingHoursList.push({
          days: institute.workingDays.join(", "),
          time: `${formatTime(institute.startTime)} - ${formatTime(institute.endTime)}`,
        });
      } else {
        workingHoursList.push(
          { days: "الأحد - الخميس", time: institute.workingHours || "08:00-20:00" },
          { days: "الجمعة - السبت", time: "مغلق" }
        );
      }

      return {
        id: institute.id,
        name: institute.name,
        description: institute.description,
        location: institute.location,
        contact: {
          phone: institute.phoneNumber || institute.contactInfo || "",
          email: institute.email || "",
        },
        workingHours: workingHoursList,
        ownerName: institute.ownerName,
        tenantName: institute.tenantName,
        status: institute.status,
      };
    }

    return {
      id: 0,
      name: "معهد التدريب",
      description: "",
      location: "",
      contact: { phone: "", email: "" },
      workingHours: [],
      ownerName: "",
      tenantName: "",
      status: "",
    };
  }, [institute]);

  const instituteCourses = courses;

  const handleViewSessions = async (courseId: number) => {
    if (institute) {
      await dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId, instituteId: institute.id }));
      setExpandedCourseId(courseId === expandedCourseId ? null : courseId);
    }
  };

  const handleToggle = (courseId: number) => {
    setExpandedCourseId(courseId === expandedCourseId ? null : courseId);
  };

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Typography
                  variant="h3"
                  fontWeight="900"
                  sx={{ color: "#1E293B" }}>
                  {displayInfo.name}
                </Typography>
                {institute?.status && (
                  <Chip
                    label={institute.status === "ACTIVE" ? "نشط" : "غير نشط"}
                    color={institute.status === "ACTIVE" ? "success" : "default"}
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>

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
              }}
            >
              <SchoolIcon color="primary" />
              الدورات التدريبية المتاحة
            </Typography>

            <Stack spacing={2}>
              {coursesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : instituteCourses.length > 0 ? (
                instituteCourses.map((course) => (
                  <React.Fragment key={course.id}>
                    <InstituteCard 
                      course={course} 
                      isExpanded={expandedCourseId === course.id}
                      onToggle={() => handleToggle(course.id)}
                      onViewSessions={() => handleViewSessions(course.id)}
                    />
                    {expandedCourseId === course.id && (
                      <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                        {courseSessionsLoading[course.id] ? (
                          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : courseSessionsError[course.id] ? (
                          <Typography color="error" textAlign="center">
                            {courseSessionsError[course.id]}
                          </Typography>
                        ) : courseSessions[course.id] && courseSessions[course.id].length > 0 ? (
                          <Stack spacing={1}>
                            {courseSessions[course.id].map((session) => (
                              <Card 
                                key={session.id}
                                sx={{
                                  borderRadius: "12px",
                                  backgroundColor: "rgba(255,255,255,0.8)",
                                  border: "1px solid rgba(19, 62, 101, 0.1)"
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                      <Typography variant="subtitle2" fontWeight="bold">
                                        {session.title}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        المدرب: {session.teacherName} | المدة: {session.duration}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        المكان: {session.location}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "left" }}>
                                      <Typography variant="h6" color="primary" fontWeight="bold">
                                        ${session.price}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        المقاعد المتاحة: {session.availableSeats}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        ) : (
                          <Typography textAlign="center" color="text.secondary">
                            لا توجد دورات متاحة حاليًا لهذه الدورة
                          </Typography>
                        )}
                      </Box>
                    )}
                  </React.Fragment>
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
                  }}
                >
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

export default InstituteDetails;
