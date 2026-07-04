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
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Skeleton,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalExpandedCourseId, setModalExpandedCourseId] = useState<number | null>(null);

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
      
      // Clean description to remove random/English text
      let cleanDescription = institute.description || "";
      // Remove any text that looks like English or random characters
      // Or just keep Arabic text
      const arabicRegex = /[\u0600-\u06FF\s،؛؟.,!0-9]+/g;
      const matches = cleanDescription.match(arabicRegex);
      cleanDescription = matches ? matches.join("").trim() : "";

      return {
        id: institute.id,
        name: institute.name,
        description: cleanDescription,
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
      const isCurrentlyExpanded = expandedCourseId === courseId;
      if (isCurrentlyExpanded) {
        setExpandedCourseId(null);
      } else {
        setExpandedCourseId(courseId);
        await dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId, instituteId: institute.id }));
      }
    }
  };

  const handleModalViewSessions = async (courseId: number) => {
    if (institute) {
      const isCurrentlyExpanded = modalExpandedCourseId === courseId;
      if (isCurrentlyExpanded) {
        setModalExpandedCourseId(null);
      } else {
        setModalExpandedCourseId(courseId);
        await dispatch(actGetActiveOrUpcomingByCourseAndInstitute({ courseId, instituteId: institute.id }));
      }
    }
  };

  if (loading) {
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
            {/* Left Column Skeleton */}
            <Box>
              <Box sx={{ mb: 6, textAlign: "right" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  <Skeleton variant="text" width="40%" height={48} />
                  <Skeleton variant="rounded" width={80} height={32} />
                </Box>

                <Stack spacing={1}>
                  <Skeleton variant="text" width="100%" height={24} />
                  <Skeleton variant="text" width="90%" height={24} />
                  <Skeleton variant="text" width="70%" height={24} />
                </Stack>
              </Box>

              <Stack
                direction="row-reverse"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Skeleton variant="text" width={100} height={28} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={200} height={28} />
                </Box>
              </Stack>

              <Stack spacing={2}>
                {[0,1,2].map((i) => (
                  <Card
                    key={i}
                    elevation={0}
                    sx={{
                      borderRadius: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                    }}
                  >
                    <CardContent sx={{ p: "18px !important" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 2 }}>
                        <Skeleton variant="circular" width={54} height={54} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" width="70%" height={28} sx={{ mb: 0.5 }} />
                          <Skeleton variant="text" width="90%" height={20} />
                        </Box>
                        <Skeleton variant="circular" width={40} height={40} />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* Right Column Skeleton */}
            <Box>
              <Stack spacing={4}>
                {/* Location Skeleton */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "28px",
                    bgcolor: "rgba(255, 255, 255, 0.45)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width="120" height={24} />
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: "20px" }} />
                  <Skeleton variant="text" width="70%" height={20} sx={{ mt: 2, mx: "auto" }} />
                </Paper>

                {/* Working Hours Skeleton */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "28px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="100" height={24} />
                  </Box>
                  <Stack spacing={1}>
                    {[0,1].map((i) => (
                      <Box key={i} sx={{ display: "flex", justifyContent: "space-between", p: 1.5, borderRadius: "12px" }}>
                        <Skeleton variant="text" width="100" height={20} />
                        <Skeleton variant="text" width="100" height={20} />
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Contact Skeleton */}
                <Box sx={{ px: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="100" height={24} />
                  </Box>
                  <Stack spacing={2}>
                    {[0,1].map((i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" width="80" height={16} sx={{ mb: 0.5 }} />
                          <Skeleton variant="text" width="120" height={20} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
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

            <Stack
              direction="row-reverse"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              {instituteCourses.length > 3 && (
                <Button
                  onClick={() => setModalOpen(true)}
                  sx={{
                    color: "#2196f3",
                    fontWeight: "bold",
                    fontFamily: "Tajawal",
                  }}
                >
                  عرض الكل
                </Button>
              )}
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <SchoolIcon color="primary" />
                الدورات التدريبية المتاحة
              </Typography>
            </Stack>

            <Stack spacing={2}>
              {coursesLoading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <Card
                      key={i}
                      elevation={0}
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                      }}
                    >
                      <CardContent sx={{ p: "18px !important" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                          <Skeleton variant="circular" width={54} height={54} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Skeleton variant="text" width="70%" height={28} sx={{ mb: 0.5 }} />
                            <Skeleton variant="text" width="90%" height={20} />
                          </Box>
                          <Skeleton variant="circular" width={40} height={40} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : instituteCourses.length > 0 ? (
                <>
                  {instituteCourses.slice(0, 3).map((course) => (
                    <React.Fragment key={course.id}>
                      <InstituteCard 
                        course={course} 
                        isExpanded={expandedCourseId === course.id}
                        onToggle={() => handleViewSessions(course.id)}
                      />
                      {expandedCourseId === course.id && (
                        <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                          {courseSessionsLoading[course.id] ? (
                            <Stack spacing={1}>
                              {[0, 1].map((i) => (
                                <Card key={i} sx={{ borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(19, 62, 101, 0.1)" }}>
                                  <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
                                        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                                        <Skeleton variant="text" width="50%" height={20} />
                                      </Box>
                                      <Box sx={{ textAlign: "left", minWidth: 100 }}>
                                        <Skeleton variant="text" width="40%" height={28} sx={{ mb: 0.5 }} />
                                        <Skeleton variant="text" width="70%" height={16} />
                                      </Box>
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          ) : courseSessionsError[course.id] ? (
                            <Typography color="error" textAlign="center">
                              {courseSessionsError[course.id]}
                            </Typography>
                          ) : courseSessions[course.id] && courseSessions[course.id].length > 0 ? (
                            <Stack spacing={1}>
                              {courseSessions[course.id].map((session) => (
                                <Card 
                                  key={session.id}
                                  onClick={() => navigate(`/main/training-session-details/${session.id}`)}
                                  sx={{
                                    borderRadius: "12px",
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    border: "1px solid rgba(19, 62, 101, 0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      backgroundColor: "rgba(25, 118, 210, 0.05)",
                                      borderColor: "rgba(25, 118, 210, 0.3)",
                                    }
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
                  ))}
                </>
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

            {/* Modal for All Courses */}
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
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
                  جميع الدورات التدريبية المتاحة
                </Typography>
                <IconButton onClick={() => setModalOpen(false)} sx={{ bgcolor: "#fff" }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <DialogContent sx={{ p: 4, pt: 2, overflowY: "auto", bgcolor: "#F8FAFC", maxHeight: "70vh" }}>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {instituteCourses.map((course) => (
                    <React.Fragment key={course.id}>
                      <InstituteCard 
                        course={course} 
                        isExpanded={modalExpandedCourseId === course.id}
                        onToggle={() => handleModalViewSessions(course.id)}
                      />
                      {modalExpandedCourseId === course.id && (
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
                                  onClick={() => navigate(`/main/training-session-details/${session.id}`)}
                                  sx={{
                                    borderRadius: "12px",
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    border: "1px solid rgba(19, 62, 101, 0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      backgroundColor: "rgba(25, 118, 210, 0.05)",
                                      borderColor: "rgba(25, 118, 210, 0.3)",
                                    }
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
                  ))}
                </Stack>
              </DialogContent>
            </Dialog>
          </Box>

          <SidebarInfo info={displayInfo} />
        </Box>
      </Container>
    </Box>
  );
});

export default InstituteDetails;
