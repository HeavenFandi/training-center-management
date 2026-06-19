import { Box, Typography, Paper, Stack, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export function SectionTitle({ title }: { title: string }) {
  return (
    <Typography
      sx={{
        fontSize: "24px",
        fontWeight: 800,
        color: "#0f172a",
        mb: 2.5,
        fontFamily: "Tajawal, sans-serif",
      }}>
      {title}
    </Typography>
  );
}

export function StatCard({
  icon,
  label,
  value,
  sectionSx,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sectionSx: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...sectionSx,
        width: 150,
        p: 2.5,
        textAlign: "center",
      }}>
      <Box sx={{ color: "#2563eb", mb: 1 }}>{icon}</Box>
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "16px",
          mb: 1,
          fontFamily: "Tajawal, sans-serif",
        }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "Tajawal, sans-serif",
        }}>
        {value}
      </Typography>
    </Paper>
  );
}

export function StatCardWide({
  icon,
  label,
  value,
  sectionSx,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sectionSx: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...sectionSx,
        p: 2.5,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: "rgba(74, 127, 167, 1)", display: "flex" }}>
          {icon}
        </Box>
        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 700,
            fontFamily: "Tajawal, sans-serif",
          }}>
          {label}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "Tajawal, sans-serif",
        }}>
        {value}
      </Typography>
    </Paper>
  );
}

export function ContactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "14px",
          backgroundColor: "#eff6ff",
          color: "rgba(74, 127, 167, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "15px",
            fontFamily: "Tajawal, sans-serif",
          }}>
          {label}
        </Typography>
        <Typography
          sx={{
            color: "#0f172a",
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "Tajawal, sans-serif",
          }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
