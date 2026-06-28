import React,{memo} from "react";
import { Paper, Box, Typography, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

type DataItem = {
  value: number;
};
type Props = {
  data: DataItem[];
  total: number;
  previous: number;
};
const FinancialCard: React.FC<Props> = ({ data, total, previous }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        display: "flex",
        flexDirection: "column",
        direction: "ltr",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Chip
          label="+32%"
          size="small"
          sx={{
            bgcolor: "#e8f5e9",
            color: "green",
            fontSize: "0.7rem",
          }}
        />

        <Box sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              الأداء المالي
            </Typography>
            <TrendingUp sx={{ fontSize: 30, color: "#6d7fa0" }} />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.6rem" }}
          >
            اجمالي ايرادات الشهر
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "50%", height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3d729e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5887ad" stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="value"
                stroke="#5887ad"
                fill="url(#colorVal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" fontWeight="900" sx={{ color: "#1a2c4e" }}>
            {total} $
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.6rem" }}
          >
            مقابل {previous} $ الشهر الماضي
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default memo(FinancialCard);


