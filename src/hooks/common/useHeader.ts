import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/Auth/authSlice";

export const useHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
    },
    [],
  );

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const isActiveLink = useCallback(
    (path: string): boolean => {
      if (path.startsWith("#")) return location.hash === path;

      if (path === "/main") {
        return location.pathname === "/main";
      }

      return location.pathname === path;
    },
    [location.hash, location.pathname],
  );

  const handleNavClick = useCallback(
    (path: string) => {
      handleCloseNavMenu();

      if (path.startsWith("#")) {
        const element = document.getElementById(path.substring(1));
        if (element) element.scrollIntoView({ behavior: "smooth" });
        return;
      }

      navigate(path);
      window.scrollTo(0, 0);
    },
    [handleCloseNavMenu, navigate],
  );

  const handleAuthClick = useCallback(() => {
    handleCloseNavMenu();

    if (isLoggedIn) {
      dispatch(logout());
      navigate("/login", { replace: true });
      return;
    }

    navigate("/");
  }, [dispatch, handleCloseNavMenu, isLoggedIn, navigate]);

  return {
    anchorElNav,
    handleOpenNavMenu,
    handleCloseNavMenu,
    handleNavClick,
    handleAuthClick,
    isActiveLink,
    isLoggedIn,
  };
};
