import React from "react";
import { Grid, Card, Box, Skeleton } from "@mui/material";

interface CourseCardSkeletonProps {
  count?: number;
}

const CourseCardSkeleton: React.FC<CourseCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <Grid container spacing={3} dir="rtl" sx={{ width: "100%", m: 0 }} alignItems="flex-start">
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, xl: 6, md: 6 }} key={index}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              borderRadius: "20px",
              backgroundColor: "rgba(248, 250, 252, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 40,
                height: 40,
                borderRadius: "50%",
                zIndex: 1,
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Box
              sx={{
                width: "100%",
                p: 2,
                pl: { xs: 6, sm: 6 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 0.5, gap: 0.5 }}>
                  <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1.5 }} />
                </Box>

                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1.5 }} />

                <Box sx={{ mb: 1.5, gap: 0.5 }}>
                  <Skeleton variant="text" width="50%" height={18} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={18} />
                </Box>

                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: "10px", mb: 1.5 }} />
              </Box>

              <Grid container spacing={1} mt="auto">
                <Grid size={{ xs: 12, xl: 6, lg: 6, md: 12, sm: 12 }}>
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: "10px" }} />
                </Grid>
                <Grid size={{ xs: 12, xl: 6, lg: 6, md: 12, sm: 12 }}>
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: "10px" }} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(CourseCardSkeleton);
