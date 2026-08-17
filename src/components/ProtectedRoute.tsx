import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import authTokenManager from "../utils/authTokenManager";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isHydrated } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();
  const hasToken = authTokenManager.hasToken();

  if (!isHydrated) {
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
    // If there's no token and no authenticated user, send to login.
    if (!hasToken) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Token exists but auth state is not available — treat as unauthenticated.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, ensure the user is on a route appropriate to their role.
  const userType = user?.userType;
  const roleDestination =
    userType === "ADMIN"
      ? "/admin-dashboard"
      : userType === "TEACHER"
      ? "/teacher-dashboard"
      : "/main";

  const pathname = location.pathname || "/";

  // Redirect users trying to access other-role dashboards back to their dashboard.
  if (pathname.startsWith("/admin-dashboard") && userType !== "ADMIN") {
    if (pathname !== roleDestination) {
      return <Navigate to={roleDestination} replace />;
    }
  }

  if (pathname.startsWith("/teacher-dashboard") && userType !== "TEACHER") {
    if (pathname !== roleDestination) {
      return <Navigate to={roleDestination} replace />;
    }
  }

  // Student dashboard lives under /main/student-dashboard — ensure students don't land on admin/teacher areas
  if (pathname.startsWith("/main") && userType === "ADMIN") {
    // Admins navigating to /main should be sent to admin dashboard
    if (pathname !== roleDestination) {
      return <Navigate to={roleDestination} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
