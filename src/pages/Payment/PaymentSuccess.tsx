import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  actFetchProfile,
  actFetchTrainingHours,
  actFetchCompletionPercentage,
  actFetchWeeklySchedule,
  actFetchActiveStudentCourses,
} from "../../store/StudentProfile/studentProfileSlice";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, userType } = useAppSelector((state) => state.auth);

  const courseName = searchParams.get("courseName");
  const paymentDate = searchParams.get("paymentDate");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    // Refresh all student profile and dashboard data after successful payment
    if (
      userType === "STUDENT" &&
      user?.studentId &&
      !isNaN(Number(user.studentId))
    ) {
      const studentId = Number(user.studentId);
      dispatch(actFetchProfile(studentId));
      dispatch(actFetchTrainingHours(studentId));
      dispatch(actFetchCompletionPercentage(studentId));
      dispatch(actFetchWeeklySchedule({ studentId }));
      dispatch(actFetchActiveStudentCourses(studentId));
    }
  }, [dispatch, user, userType]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
          direction: "rtl",
          fontFamily: "Tajawal, sans-serif",
          py: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            bgcolor: "#4caf50",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(76, 175, 80, 0.4)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <CheckIcon sx={{ fontSize: { xs: 60, sm: 70 }, color: "white" }} />
        </Box>

        <Typography variant="h3" fontWeight="bold" sx={{ color: "#051630" }}>
          تم الدفع بنجاح!
        </Typography>

        <Typography variant="h6" sx={{ color: "#50627b", mb: 2 }}>
          تم تسجيل اشتراكك في الدورة بنجاح. يمكنك الآن متابعة التعلم.
        </Typography>

        {(courseName || paymentDate || transactionId) && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 500,
              p: 3,
              borderRadius: "20px",
              bgcolor: "#f8fbff",
              border: "1px solid #eef2f6",
            }}
          >
            <Stack spacing={2} alignItems="stretch">
              {courseName && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ color: "#7b8794" }}>
                    اسم الدورة
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: "#051630" }}
                  >
                    {courseName}
                  </Typography>
                </Box>
              )}
              {paymentDate && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ color: "#7b8794" }}>
                    تاريخ الدفع
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: "#051630" }}
                  >
                    {paymentDate}
                  </Typography>
                </Box>
              )}
              {transactionId && (
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ color: "#7b8794" }}>
                    رقم العملية
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: "#051630", wordBreak: "break-all" }}
                  >
                    {transactionId}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<SchoolIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => {
              // If the user is authenticated and is a student, take them to their dashboard.
              // Otherwise send them to the public main page to avoid forcing a login redirect
              // when Stripe redirects back and the auth state may not be present (different origin/port).
              if (user && userType === "STUDENT") {
                navigate("/main/student-dashboard");
              } else {
                navigate("/main");
              }
            }}
            sx={{
              bgcolor: "#051630",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#133e65" },
            }}
          >
            ابدأ التعلم الآن
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon sx={{ ml: 1, mr: 0 }} />}
            onClick={() => navigate("/main")}
            sx={{
              color: "#051630",
              borderColor: "#051630",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#133e65",
                bgcolor: "rgba(5, 22, 48, 0.04)",
              },
            }}
          >
            العودة للرئيسية
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
