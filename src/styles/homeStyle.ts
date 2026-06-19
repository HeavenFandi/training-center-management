import { SxProps, Theme } from "@mui/material";

export const homeContainerStyle: SxProps<Theme> = {
  background: `radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
               radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
               #bdd1e67f`,
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
};

export const mainContentStyle: SxProps<Theme> = {
  flexGrow: 1,
};
