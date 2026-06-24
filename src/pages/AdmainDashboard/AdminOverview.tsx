import React, { memo, useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, IconButton, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/Auth/authSlice";
import { actGetInstituteByUserId, actGetInstituteMonthlyRegistrations } from "../../store/Institutes/institutesSlice";
import MonthlyRegistrationChart from "../../components/AdminDasboard/MainDashboard/MonthlyRegistrationChart";
import FinancialCard from "../../components/AdminDasboard/MainDashboard/FinancialCard";
import ScheduleCard from "../../components/AdminDasboard/MainDashboard/ScheduleCard";
import Card from "../../components/AdminDasboard/MainDashboard/Card";
import { useDelayedLoading } from "../../hooks/useDelayedLoading";
import {
  statsAdmin,
  financialData,
  schedule
} from "../../data/DasboardData";

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
  const { currentInstitute, currentInstituteLoading, monthlyRegistrations, monthlyRegistrationsLoading, monthlyRegistrationsError } =
    useAppSelector((state) => state.institutes);
    
  const showInstituteLoading = useDelayedLoading(currentInstituteLoading);

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const currentYear = selectedYear;

  // Process data to fill missing months with 0 and map to Arabic names
  const processedChartData = useMemo(() => {
    console.log("Monthly registrations response (processedChartData):", monthlyRegistrations);
    monthlyRegistrations.forEach((item, idx) => {
      console.log(`Item ${idx} keys:`, Object.keys(item));
      console.log(`Item ${idx} values:`, Object.values(item));
    });
    const result: { name: string; value: number }[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthData = monthlyRegistrations.find((item) => 
        item.month === i || item.Month === i || item.monthNumber === i || item.MonthNumber === i
      );
      console.log(`Looking for month ${i}, found:`, monthData);
      const regValue = monthData?.registrations ?? monthData?.Registrations ?? monthData?.count ?? 0;
      result.push({
        name: arabicMonths[i],
        value: regValue,
      });
    }
    console.log("AdminOverview: processedChartData:", result);
    return result;
  }, [monthlyRegistrations]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // First, fetch institute by userId
  useEffect(() => {
    console.log("auth user:", user);
    const userId = user?.id;
    console.log("admin userId:", userId);
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  // Fetch monthly registrations only when currentInstitute exists
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    console.log("currentInstitute:", currentInstitute);
    console.log("currentInstitute.id:", currentInstitute?.id);
    console.log("Year:", currentYear);
    if (!currentInstitute?.id) {
      return; // Guard clause
    }
    dispatch(actGetInstituteMonthlyRegistrations({ id: instituteId, year: currentYear }));
  }, [dispatch, currentInstitute, currentYear]);

  // Log state changes
  useEffect(() => {
    console.log("AdminOverview: monthlyRegistrations:", monthlyRegistrations);
    console.log("AdminOverview: monthlyRegistrationsLoading:", monthlyRegistrationsLoading);
    console.log("AdminOverview: monthlyRegistrationsError:", monthlyRegistrationsError);
  }, [monthlyRegistrations, monthlyRegistrationsLoading, monthlyRegistrationsError]);

  const userId = user?.id;

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
        {statsAdmin.map((s, index) => (
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
                 <ScheduleCard data={schedule} />
               </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <FinancialCard data={financialData} total={4500} previous={3500} />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(AdminOverview);


