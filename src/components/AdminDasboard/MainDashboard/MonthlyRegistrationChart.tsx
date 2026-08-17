import React, { memo } from "react";
import { Paper, Box, Typography, CircularProgress, Alert, Skeleton } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
  loading?: boolean;
  error?: string | null;
  year?: number;
};

const MonthlyRegistrationChart: React.FC<Props> = ({ data, loading, error, year }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        minHeight: 380,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }
      }}
    >
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          معدل التسجيل الشهري
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight="bold"
        >
          تحليل بيانات الطلاب الجدد لعام {year}
        </Typography>
      </Box>

      {/* Explicit container with fixed dimensions */}
      <Box sx={{ width: "100%", height: 320 }}>
        {loading ? (
          <Box sx={{ height: "100%" }}>
            {/* Y-axis skeleton */}
            <Box sx={{ display: "flex", height: "100%" }}>
              <Box sx={{ width: "10%", display: "flex", flexDirection: "column", justifyContent: "space-between", py: 2 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Chart area */}
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "flex-end", gap: 2, px: 2, pb: 1 }}>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width="100%"
                      height={`${30 + Math.random() * 70}%`}
                      sx={{ borderRadius: "8px 8px 0 0" }}
                    />
                  ))}
                </Box>
                {/* X-axis */}
                <Box sx={{ display: "flex", justifyContent: "space-around", pt: 1 }}>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} variant="text" width={30} height={20} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ height: "100%", justifyContent: "center" }}>
            {error}
          </Alert>
        ) : data.every(d => d.value === 0) ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Typography variant="body1" color="text.secondary">لا توجد تسجيلات لهذا العام</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#99a" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#99a" }}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="value"
                fill="#5887ad"
                radius={[8, 8, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default memo(MonthlyRegistrationChart);

