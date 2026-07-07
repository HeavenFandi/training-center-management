import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isHydrated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (import.meta.env.DEV) {
    console.log("🛡️ ProtectedRoute called with location:", location.pathname);
    console.log("  - isHydrated:", isHydrated);
    console.log("  - isAuthenticated:", isAuthenticated);
    console.log("  - user:", user);
  }

  if (!isHydrated) {
    if (import.meta.env.DEV) {
      console.log("🔄 ProtectedRoute: waiting for hydration...");
    }
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    if (import.meta.env.DEV) {
      console.log("🚫 ProtectedRoute: not authenticated, redirecting to /login");
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (import.meta.env.DEV) {
    console.log("✅ ProtectedRoute: authenticated, rendering children");
  }
  return <>{children}</>;
};

export default ProtectedRoute;
