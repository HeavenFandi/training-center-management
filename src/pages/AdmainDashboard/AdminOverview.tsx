import React, { memo, useEffect, useMemo, useState, useRef } from "react";
import { Box, Grid, Typography, IconButton, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/Auth/authSlice";
import { actGetInstituteByUserId, actGetInstituteMonthlyRegistrations, actGetInstituteFinancialMonthly, actGetInstituteUsersCount } from "../../store/Institutes/institutesSlice";
import { actGetAllLectures, clearTrainingSessionsState, resetTrainingSessions } from "../../store/Courses/trainingSessionsSlice";
import actGetCoursesByTenantId from "../../store/Courses/act/actGetCoursesByTenantId";
import { clearCoursesState, selectCoursesState } from "../../store/Courses/courseSlice";
import { clearTeachersState } from "../../store/teachers/teachersSlice";
import MonthlyRegistrationChart from "../../components/AdminDasboard/MainDashboard/MonthlyRegistrationChart";
import FinancialCard from "../../components/AdminDasboard/MainDashboard/FinancialCard";
import ScheduleCard from "../../components/AdminDasboard/MainDashboard/ScheduleCard";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const arabicMonths: Record<number, string> = {
  1: "يناير",
  2: "فبراير",
  3: "مارس",
  4: "أبريل",
  5: "مايو",
  6: "يونيو",
  7: "يوليو",
  8: "أغسطس",
  9: "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute, currentInstituteLoading, monthlyRegistrations, monthlyRegistrationsLoading, monthlyRegistrationsError, financialMonthly, financialMonthlyLoading, financialMonthlyError, usersCount, usersCountLoading, usersCountError } =
    useAppSelector((state) => state.institutes);
  const { allLectures, allLecturesLoading, allLecturesError } =
    useAppSelector((state) => state.trainingSessions);
  const { courses, loading: coursesLoading, error: coursesError } = useAppSelector(selectCoursesState);
    
  const showInstituteLoading = useDelayedLoading(currentInstituteLoading);
  
  // Track previous institute id
  const previousInstituteIdRef = useRef<number | null>(null);

  // Clear state when institute changes
  useEffect(() => {
    const currentInstituteId = currentInstitute?.id || null;
    if (previousInstituteIdRef.current !== currentInstituteId) {
      if (import.meta.env.DEV) {
        console.log(`[AdminOverview] Institute changed from ${previousInstituteIdRef.current} to ${currentInstituteId}, clearing state...`);
      }
      dispatch(clearCoursesState());
      dispatch(clearTrainingSessionsState());
      dispatch(clearTeachersState());
      previousInstituteIdRef.current = currentInstituteId;
    }
  }, [currentInstitute?.id, dispatch]);

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayLectures = useMemo(() => {
    const today = getTodayDate();
    if (import.meta.env.DEV) {
      console.log("allLectures from Redux:", allLectures);
      console.log("today date:", today);
    }
    const filtered = allLectures.filter(lecture => lecture.lectureDate === today);
    if (import.meta.env.DEV) {
      console.log("filtered todayLectures:", filtered);
    }
    return filtered;
  }, [allLectures]);

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const currentYear = selectedYear;

  // Process data to fill missing months with 0 and map to Arabic names
  const processedChartData = useMemo(() => {
    if (import.meta.env.DEV) {
      console.log("Monthly registrations response (processedChartData):", monthlyRegistrations);
      monthlyRegistrations.forEach((item, idx) => {
        console.log(`Item ${idx} keys:`, Object.keys(item));
        console.log(`Item ${idx} values:`, Object.values(item));
      });
    }
    const result: { name: string; value: number }[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthData = monthlyRegistrations.find((item) => 
        item.month === i || item.Month === i || item.monthNumber === i || item.MonthNumber === i
      );
      if (import.meta.env.DEV) {
        console.log(`Looking for month ${i}, found:`, monthData);
      }
      const regValue = monthData?.registrations ?? monthData?.Registrations ?? monthData?.count ?? 0;
      result.push({
        name: arabicMonths[i],
        value: regValue,
      });
    }
    if (import.meta.env.DEV) {
      console.log("AdminOverview: processedChartData:", result);
    }
    return result;
  }, [monthlyRegistrations]);

  // Process financial monthly data
  const processedFinancialData = useMemo(() => {
    if (import.meta.env.DEV) {
      console.log("Financial monthly response (processedFinancialData):", financialMonthly);
    }
    const result: { name: string; totalRevenue: number; totalPayments: number }[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthData = financialMonthly.find((item) => 
        item.month === i || item.Month === i || item.monthNumber === i || item.MonthNumber === i
      );
      result.push({
        name: arabicMonths[i],
        totalRevenue: monthData?.totalRevenue ?? 0,
        totalPayments: monthData?.totalPayments ?? 0,
      });
    }
    if (import.meta.env.DEV) {
      console.log("AdminOverview: processedFinancialData:", result);
    }
    return result;
  }, [financialMonthly]);

  // Calculate total revenue and total payments for the year
  const totalYearlyRevenue = useMemo(() => {
    return processedFinancialData.reduce((sum, item) => sum + item.totalRevenue, 0);
  }, [processedFinancialData]);

  const totalYearlyPayments = useMemo(() => {
    return processedFinancialData.reduce((sum, item) => sum + item.totalPayments, 0);
  }, [processedFinancialData]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // First, fetch institute by userId
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("auth user:", user);
    }
    const userId = user?.id;
    if (import.meta.env.DEV) {
      console.log("admin userId:", userId);
    }
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  // Fetch monthly registrations only when currentInstitute exists
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    if (import.meta.env.DEV) {
      console.log("currentInstitute:", currentInstitute);
      console.log("currentInstitute.id:", currentInstitute?.id);
      console.log("Year:", currentYear);
    }
    if (!currentInstitute?.id) {
      return; // Guard clause
    }
    dispatch(actGetInstituteMonthlyRegistrations({ id: instituteId, year: currentYear }));
  }, [dispatch, currentInstitute, currentYear]);

  // Fetch financial monthly data only when currentInstitute exists
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    if (import.meta.env.DEV) {
      console.log("currentInstitute (financial):", currentInstitute);
      console.log("currentInstitute.id (financial):", currentInstitute?.id);
      console.log("Year (financial):", currentYear);
    }
    if (!currentInstitute?.id) {
      return; // Guard clause
    }
    dispatch(actGetInstituteFinancialMonthly({ id: instituteId, year: currentYear }));
  }, [dispatch, currentInstitute, currentYear]);

  // Only fetch lectures after courses have loaded — if the institute has courses fetch them,
  // otherwise reset so ScheduleCard shows the empty state.
  // This prevents the race condition where global lectures arrive after an empty-courses reset.
  useEffect(() => {
    if (coursesLoading !== "succeeded") return;

    if (courses.length > 0) {
      dispatch(actGetAllLectures());
    } else {
      dispatch(resetTrainingSessions());
    }

    return () => {
      dispatch(resetTrainingSessions());
    };
  }, [dispatch, coursesLoading, courses.length]);
  
  // Fetch courses when currentInstitute exists
  useEffect(() => {
    const tenantId = currentInstitute?.tenantId;
    if (tenantId) {
      dispatch(actGetCoursesByTenantId(tenantId.toString()));
    }
  }, [dispatch, currentInstitute]);
  
  // Fetch users count when currentInstitute exists
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    if (instituteId) {
      dispatch(actGetInstituteUsersCount(instituteId));
    }
  }, [dispatch, currentInstitute]);

  // Log state changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("AdminOverview: monthlyRegistrations:", monthlyRegistrations);
      console.log("AdminOverview: monthlyRegistrationsLoading:", monthlyRegistrationsLoading);
      console.log("AdminOverview: monthlyRegistrationsError:", monthlyRegistrationsError);
    }
  }, [monthlyRegistrations, monthlyRegistrationsLoading, monthlyRegistrationsError]);

  const userId = user?.id;
  
  // Calculate active courses
  const activeCoursesCount = useMemo(() => {
    return courses.filter(course => {
      return course.status === "active" || course.status === "نشطة" || !course.status; // If no status, assume active
    }).length;
  }, [courses]);
  
  // Create dynamic stats
  const dynamicStats = useMemo(() => [
    {
      title: "اجمالي المستخدمين",
      value: usersCountLoading ? "..." : (usersCountError ? "خطأ" : (usersCount?.toString() ?? "0")),
      icon: <PeopleAltIcon />,
      color: "#1a2c4e",
    },
    {
      title: "الدورات النشطة",
      value: coursesLoading === "pending" ? "..." : (coursesError ? "خطأ" : activeCoursesCount.toString()),
      icon: <MenuBookIcon />,
      color: "#f39c12",
    },
  ], [usersCount, usersCountLoading, usersCountError, activeCoursesCount, coursesLoading, coursesError]);

  // Handle missing userId
  if (!userId) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography variant="h6" color="error.main">لم يتم العثور على المستخدم</Typography>
      </Box>
    );
  }

  // Show loading while currentInstitute is null/loading
  if (!currentInstitute && showInstituteLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              sx={{
                backgroundColor: "#091c39",
                color: "white",
                "&:hover": { backgroundColor: "#e9f1f8" },
                width: 28,
                height: 28,
              }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" color="#091c39">
              نظرة عامة
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 14 }}>
            إليك بعض التقارير العامة عن المعهد
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon sx={{ ml: 1 }} />}
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
            fontWeight: "bold",
            px: 3,
            borderWidth: "2px",
            "&:hover": {
              borderWidth: "2px",
              backgroundColor: "rgba(211, 47, 47, 0.04)"
            }
          }}
        >
          تسجيل الخروج
        </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {dynamicStats.map((s, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
            <Card item={s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <MonthlyRegistrationChart 
            data={processedChartData} 
            loading={monthlyRegistrationsLoading} 
            error={monthlyRegistrationsError} 
            year={selectedYear} 
          />
        </Grid>
         <Grid size={{ xs: 12, md: 7 }}>
                 <ScheduleCard 
                   data={todayLectures} 
                   loading={allLecturesLoading === "pending"} 
                   error={allLecturesError} 
                 />
               </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <FinancialCard 
            data={processedFinancialData.map(item => ({ value: item.totalRevenue }))} 
            total={totalYearlyRevenue} 
            previous={totalYearlyPayments} 
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(AdminOverview);


