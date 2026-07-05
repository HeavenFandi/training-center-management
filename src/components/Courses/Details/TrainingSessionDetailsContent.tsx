import React, { useState, useCallback, memo, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Modal,
  Fade,
  Rating,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useTrainingSessionDetails from "../../../hooks/trainingSessions/useTrainingSessionDetails";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { useSnackbar } from "../../../Context/SnackbarContext";
import AuthModal from "../../Modal/AuthModal";
import CloseIcon from "@mui/icons-material/Close";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import {
  actGetCourseRatings,
  actGetCourseAverageRating,
} from "../../../store/Courses/trainingSessionsSlice";

function TrainingSessionDetailsContent() {
  const {
    session,
    instructor,
    loading,
    error,
    handleAddRating,
    handleInitiatePayment,
  } = useTrainingSessionDetails();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    addRatingLoading,
    addRatingError,
    ratings,
    ratingsLoading,
    ratingsError,
    averageRating,
  } = useAppSelector((state) => state.trainingSessions);
  const { showSnackbar } = useSnackbar();

  const [openAuth, setOpenAuth] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [reviewText, setReviewText] = useState("");
  const [touched, setTouched] = useState({ rating: false, review: false });
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Helper to get current studentId
  const getCurrentStudentId = () => {
    if (user?.studentId) return user.studentId;
    const localStorageId = localStorage.getItem("studentId");
    return localStorageId ? Number(localStorageId) : null;
  };

  const currentStudentId = getCurrentStudentId();
  const isEnrolledViaIds =
    session?.enrolledStudentIds?.includes(currentStudentId as number) ?? false;
  const isUserEnrolled =
    session?.isEnrolled || session?.isRegistered || isEnrolledViaIds;

  const resolvedCourseId = session?.courseId;

  // Fetch ratings and average rating when resolvedCourseId is available
  useEffect(() => {
    if (resolvedCourseId) {
      console.log("Using resolvedCourseId to fetch ratings:", resolvedCourseId);
      dispatch(actGetCourseRatings({ courseId: resolvedCourseId }));
      dispatch(actGetCourseAverageRating({ courseId: resolvedCourseId }));
    }
  }, [resolvedCourseId, dispatch]);

  useEffect(() => {
    if (ratingsError) {
      showSnackbar(ratingsError, "error");
    }
  }, [ratingsError, showSnackbar]);

  const displayTitle = session?.courseName?.trim() || "";
  const displayImage = session?.image;
  const displayStartDate = session?.startDate || "غير محدد";

  const handleEnroll = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setIsEnrolling(true);
        const paymentUrl = await handleInitiatePayment();
        if (paymentUrl && typeof paymentUrl === "string") {
          window.location.href = paymentUrl;
        } else {
          showSnackbar(
            "لم يتم الحصول على رابط الدفع، يرجى المحاولة لاحقاً.",
            "error",
          );
        }
      } catch (err) {
        showSnackbar(
          typeof err === "string"
            ? err
            : "فشل البدء في عملية الدفع، يرجى المحاولة لاحقاً.",
          "error",
        );
      } finally {
        setIsEnrolling(false);
      }
    } else {
      setOpenAuth(true);
    }
  }, [isAuthenticated, handleInitiatePayment, showSnackbar]);

  const handleOpenReview = useCallback(() => {
    if (isAuthenticated) {
      setOpenReviewModal(true);
    } else {
      setOpenAuth(true);
    }
  }, [isAuthenticated]);

  const handleReviewSubmit = async () => {
    setTouched({ rating: true, review: true });

    if (!rating || !reviewText.trim()) {
      return;
    }

    try {
      await handleAddRating(rating, reviewText);
      if (resolvedCourseId) {
        dispatch(actGetCourseRatings({ courseId: resolvedCourseId }));
        dispatch(actGetCourseAverageRating({ courseId: resolvedCourseId }));
      }
      showSnackbar("تم إرسال تقييمك بنجاح", "success");
      setOpenReviewModal(false);
      setReviewText("");
      setRating(5);
      setTouched({ rating: false, review: false });
    } catch (err) {
      showSnackbar(
        typeof err === "string"
          ? err
          : "فشل إرسال التقييم، يرجى المحاولة لاحقاً.",
        "error",
      );
    }
  };

  // Show error snackbar if addRatingError changes
  useEffect(() => {
    if (addRatingError) {
      showSnackbar(addRatingError, "error");
    }
  }, [addRatingError, showSnackbar]);

  const handleCloseAuth = useCallback(() => setOpenAuth(false), []);
  const handleCloseSuccess = () => setOpenSuccess(false);
  const handleCloseReview = () => setOpenReviewModal(false);

  if (loading === "pending" || (!session && loading === "idle")) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8, display: "flex", justifyContent: "center" }}
      >
        <Typography sx={{ fontFamily: "Tajawal" }}>
          جاري تحميل البيانات...
        </Typography>
      </Container>
    );
  }

  if (loading === "failed") {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography sx={{ fontFamily: "Tajawal" }}>
          {error || "لم يتم العثور على الدورة التدريبية"}
        </Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography sx={{ fontFamily: "Tajawal" }}>
          لم يتم العثور على الدورة التدريبية
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }} sx={{ pl: 0 }}>
          {displayImage && (
            <Box
              component="img"
              src={displayImage}
              alt={displayTitle}
              sx={{
                width: "100%",
                height: { xs: "260px", sm: "360px", md: "430px" },
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                objectFit: "cover",
                mb: 3,
              }}
            />
          )}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 2, justifyContent: "flex-start" }}
          >
            <Avatar src={instructor?.image} sx={{ width: 60, height: 60 }} />
            <Box sx={{ textAlign: "right" }}>
              <Typography
                onClick={() => {
                  console.log("INSTRUCTOR DATA:", instructor);
                  console.log("INSTRUCTOR DATA ID:", instructor?.id);

                  const instructorId = instructor?.id;

                  if (instructorId === null || instructorId === undefined) {
                    showSnackbar(
                      "لا يمكن عرض تفاصيل المعلم لعدم توفر بيانات المعلم",
                      "error",
                    );
                    return;
                  }

                  navigate(`/main/teacher-details/${instructorId}`, {
                    state: {
                      teacher: instructor,
                    },
                  });
                }}
                sx={{
                  cursor: "pointer",
                  fontFamily: "Tajawal",
                  fontWeight: 700,
                  color: "#0b1b34",
                  fontSize: "1.1rem",
                  mr: 2,
                }}
              >
                {instructor?.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Tajawal",
                  color: "#7b8794",
                  fontSize: "0.95rem",
                  mr: 2,
                }}
              >
                {instructor?.title}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ textAlign: "right", width: "100%" }}>
            <Stack
              direction="row"
              spacing={10}
              alignItems="flex-start"
              justifyContent="flex-start"
              sx={{ mb: 1, width: "100%" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Tajawal",
                    fontWeight: 800,
                    fontSize: { xs: "1.8rem", md: "2.3rem" },
                    color: "#0b1b34",
                    pr: 0,
                    mr: 0,
                    lineHeight: 1.05,
                  }}
                >
                  {displayTitle}
                </Typography>

                {/* Rating row placed directly under the title */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 0.5, mb: 0.6, justifyContent: "flex-end" }}
                >
                  {averageRating !== undefined && averageRating !== null ? (
                    <>
                      <Rating
                        value={averageRating}
                        readOnly
                        size="small"
                        precision={0.1}
                        sx={{ color: "#ffb400" }}
                      />

                      <Typography
                        sx={{
                          fontFamily: "Tajawal",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          color: "#0b1b34",
                        }}
                      >
                        {averageRating.toFixed(1)}
                      </Typography>

                      {Array.isArray(ratings) && ratings.length > 0 && (
                        <Typography
                          onClick={() => {
                            const el =
                              document.getElementById("student-reviews");
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }}
                          sx={{
                            cursor: "pointer",
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.95rem",
                            ml: 0.5,
                          }}
                        >
                          | {ratings.length} تقييم
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: "Tajawal",
                        color: "#7b8794",
                        fontSize: "0.95rem",
                      }}
                    >
                      لا توجد تقييمات بعد
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>

            <Typography
              onClick={() => navigate(`/main/institute/1`)}
              sx={{
                cursor: "pointer",
                fontFamily: "Tajawal",
                color: "#7b8794",
                fontSize: "1rem",
                mb: 1,
                mt: 0,
              }}
            >
              {session.instituteName}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Tajawal",
                color: "#3C8DBC",
                fontWeight: 800,
                fontSize: "1.5rem",
                mb: 2,
              }}
            >
              {session.price}$
              <Box
                component="span"
                sx={{
                  fontSize: "0.9rem",
                  color: "#7b8794",
                  fontWeight: 500,
                  mr: 1,
                }}
              >
                / اشتراك كامل
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: "Tajawal",
                color: "#51606f",
                fontSize: "1rem",
                lineHeight: 2,
                mb: 1,
              }}
            >
              {session.courseDescription}
            </Typography>

            {session && (
              <Box sx={{ mb: 0, mt: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "Tajawal",
                    color: "#0b1b34",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <InfoOutlinedIcon sx={{ color: "#3C8DBC" }} />
                  تفاصيل الدورة:
                </Typography>

                <Grid container spacing={1}>
                  {/* المدة */}
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        direction: "rtl",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <AccessTimeOutlinedIcon
                          sx={{ fontSize: "1.3rem", color: "#3C8DBC" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.8rem",
                            mb: 0,
                          }}
                        >
                          المدة
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#0b1b34",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {session.duration} يوم
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* عدد الجلسات */}
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        direction: "rtl",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <MenuBookOutlinedIcon
                          sx={{ fontSize: "1.3rem", color: "#3C8DBC" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.8rem",
                            mb: 0,
                          }}
                        >
                          عدد الجلسات
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#0b1b34",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {session.numberOfLectures} جلسة
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* المقاعد */}
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        direction: "rtl",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <EventSeatOutlinedIcon
                          sx={{ fontSize: "1.3rem", color: "#3C8DBC" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.8rem",
                            mb: 0,
                          }}
                        >
                          المقاعد
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#0b1b34",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {session.availableSeats} مقعد
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* عدد الطلاب */}
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        direction: "rtl",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <GroupsOutlinedIcon
                          sx={{ fontSize: "1.3rem", color: "#3C8DBC" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.8rem",
                            mb: 0,
                          }}
                        >
                          عدد الطلاب
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#0b1b34",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {session.enrolledStudentsCount ?? 0} طلاب
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* تاريخ البداية */}
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        direction: "rtl",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box sx={{ flexShrink: 0 }}>
                        <CalendarTodayOutlinedIcon
                          sx={{ fontSize: "1.3rem", color: "#3C8DBC" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0, textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#7b8794",
                            fontSize: "0.8rem",
                            mb: 0,
                          }}
                        >
                          تاريخ البداية
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            color: "#0b1b34",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {displayStartDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ textAlign: "right", mt: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleEnroll}
                disabled={isEnrolling || isUserEnrolled}
                sx={{
                  minWidth: 260,
                  height: 52,
                  borderRadius: "15px",
                  backgroundColor: "#051630",
                  fontFamily: "Tajawal",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  boxShadow: "0 10px 20px rgba(5, 22, 48, 0.15)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4697c6",
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 30px rgba(70, 151, 198, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#051630",
                    opacity: 0.7,
                  },
                }}
              >
                {isEnrolling ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isUserEnrolled ? (
                  "تم التسجيل"
                ) : (
                  "سجل الآن"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <AuthModal open={openAuth} handleClose={handleCloseAuth} />

      <Modal
        open={openSuccess}
        onClose={handleCloseSuccess}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
            style: {
              backgroundColor: "rgba(5, 22, 48, 0.4)",
              backdropFilter: "blur(6px)",
            },
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Fade in={openSuccess}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: { xs: "90%", sm: 400 },
              borderRadius: "28px",
              p: { xs: 3, sm: 5 },
              textAlign: "center",
              outline: "none",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
            />
            <Typography
              sx={{
                fontFamily: "Tajawal",
                fontWeight: 800,
                fontSize: "1.6rem",
                color: "#0b1b34",
                mb: 1,
              }}
            >
              ! تم التسجيل بنجاح
            </Typography>
            <Typography
              sx={{
                fontFamily: "Tajawal",
                color: "#51606f",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              لقد تمت عملية الاشتراك في كورس{" "}
              <strong>{session.courseName}</strong> بنجاح. نتمنى لك رحلة تعليمية
              ممتعة.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCloseSuccess}
              sx={{
                fontFamily: "Tajawal",
                backgroundColor: "#051630",
                borderRadius: "12px",
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#4697c6" },
              }}
            >
              اغلاق
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Dialog
        open={openReviewModal}
        onClose={handleCloseReview}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            bgcolor: "#f8fbff",
            p: 1,
          },
        }}
      >
        <DialogContent
          sx={{
            textAlign: "center",
            p: { xs: 3, sm: 4 },
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseReview}
            sx={{ position: "absolute", right: 10, top: 10, color: "#0b1b34" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ mt: 1 }}>
            <Typography
              sx={{
                fontFamily: "Tajawal",
                fontWeight: 900,
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                color: "#0b1b34",
                mb: 0.5,
              }}
            >
              إضافة رأيك وتقييمك
            </Typography>
            <Typography
              sx={{
                fontFamily: "Tajawal",
                color: "#51606f",
                mb: 3,
                fontSize: "0.9rem",
              }}
            >
              رأيك يساعدنا ويساعد الطلاب الآخرين
            </Typography>

            <Typography
              sx={{
                fontFamily: "Tajawal",
                fontWeight: 700,
                color: "#5286ad",
                mb: 1.5,
              }}
            >
              ما هو تقييمك؟
            </Typography>

            <Rating
              value={rating}
              onChange={(_, val) => {
                setRating(val);
                setTouched((prev) => ({ ...prev, rating: true }));
              }}
              size="large"
              sx={{ mb: touched.rating && !rating ? 1 : 3 }}
            />
            {touched.rating && !rating && (
              <Typography color="error" sx={{ mb: 2, fontFamily: "Tajawal" }}>
                يرجى اختيار تقييم
              </Typography>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="اكتب رأيك هنا..."
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value);
                setTouched((prev) => ({ ...prev, review: true }));
              }}
              error={touched.review && !reviewText.trim()}
              helperText={
                touched.review && !reviewText.trim() ? "يرجى كتابة رأيك" : ""
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  bgcolor: "white",
                  fontFamily: "Tajawal",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleReviewSubmit}
              disabled={addRatingLoading || !rating || !reviewText.trim()}
              sx={{
                fontFamily: "Tajawal",
                bgcolor: "#051630",
                color: "white",
                py: 1.2,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#0b1b34" },
                "&.Mui-disabled": { bgcolor: "#ccc" },
              }}
            >
              {addRatingLoading ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Box sx={{ mt: 10 }}>
        <Stack
          direction={{ xs: "column-reverse", sm: "row-reverse" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "center" }}
          spacing={2}
          sx={{ mb: 5 }}
        >
          <Button
            variant="contained"
            onClick={handleOpenReview}
            startIcon={<AddCommentIcon sx={{ ml: 1 }} />}
            sx={{
              backgroundColor: "#5286ad",
              borderRadius: "15px",
              fontFamily: "Tajawal",
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              px: { xs: 3, sm: 4 },
              py: 1.2,
              boxShadow: "0 8px 16px rgba(82, 134, 173, 0.3)",
              "&:hover": { backgroundColor: "#3c6d91" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            أضف رأيك وتقييمك
          </Button>

          <Typography
            id="student-reviews"
            sx={{
              fontFamily: "Tajawal",
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
              color: "#0b1b34",
              textAlign: "right",
            }}
          >
            آراء الطلاب السابقين
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {ratingsLoading === "pending" ? (
            <Grid size={12} sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ fontFamily: "Tajawal" }}>
                جاري تحميل آراء الطلاب...
              </Typography>
            </Grid>
          ) : ratings.length === 0 ? (
            <Grid size={12} sx={{ textAlign: "center", py: 4 }}>
              <Typography
                sx={{
                  fontFamily: "Tajawal",
                  fontSize: "1.2rem",
                  color: "#7b8794",
                }}
              >
                لا توجد آراء بعد
              </Typography>
            </Grid>
          ) : (
            ratings.map((ratingItem) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ratingItem.id}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(3, 26, 59, 0.08)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Stack direction="column" sx={{ mb: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      justifyContent={"space-between"}
                    >
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            fontFamily: "Tajawal",
                            fontWeight: 700,
                            color: "#0b1b34",
                            fontSize: "1rem",
                            mb: 0.5,
                          }}
                        >
                          {ratingItem.username || ratingItem.name}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#3C8DBC",
                          fontWeight: 700,
                        }}
                      >
                        {(ratingItem.username || ratingItem.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    </Stack>
                    <Rating
                      value={ratingItem.rating}
                      readOnly
                      size="medium"
                      sx={{ color: "#ffb400" }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      fontFamily: "Tajawal",
                      color: "#374151",
                      textAlign: "right",
                      fontSize: "0.95rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {ratingItem.review || ratingItem.text}
                  </Typography>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default memo(TrainingSessionDetailsContent);
