import { SxProps, Theme } from "@mui/material";

interface Tprops {
  path: string;
  isActivePath: (path: string) => boolean;
}

export const getNavButtonStyle = ({
  path,
  isActivePath,
}: Tprops): SxProps<Theme> => {
  const isActive = isActivePath(path);
  return {
    color: isActive 
      ? "#6366F1"
      : "#051630",
    px: 2,
    py: 1,
    fontWeight: isActive ? 800 : 600,
    fontSize: "1rem",
    fontFamily: "Tajawal",
    transition: "all 0.3s ease",
    textTransform: "none",
    display: "flex",
    flexDirection: "row-reverse",
    gap: 0.5,
    borderRadius: "12px",
    position: "relative",
    "& .MuiButton-startIcon": {
      marginLeft: "8px",
      marginRight: "-4px",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0px",
      right: "5%",
      width: "90%",
      height: "3px",
      backgroundColor: "#6366F1",
      transform: isActive ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRadius: "10px",
    },
    "&:hover": {
      backgroundColor: "rgba(99, 102, 241, 0.08)",
      color: "#6366F1",
      "&::after": {
        transform: "scaleX(1)",
      },
      "& .MuiSvgIcon-root": { transform: "translateY(-3px)" },
    },
  };
};

export const appBarStyle: SxProps<Theme> = {
  top: 0,
  zIndex: 1100,
  backgroundColor: "#ffffff",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 2px 20px rgba(5, 22, 48, 0.08)",
  borderBottom: "1px solid rgba(5, 22, 48, 0.06)",
  backgroundImage: "none",
};

export const logoSectionStyle: SxProps<Theme> = {
  ml: { xs: 0, md: 4 },
  cursor: "pointer",
  "& .logo-container": {
    p: 0.5,
    display: "flex",
    transition: "0.3s",
    "&:hover": { transform: "scale(1.05)" },
  },
  "& img": {
    height: "65px",
  },
};

export const authButtonStyle = (isLoggedIn: boolean): SxProps<Theme> => ({
  bgcolor: "#6366F1",
  color: "#ffffff",
  borderRadius: "20px",
  px: 4,
  py: 1.2,
  fontWeight: 800,
  fontFamily: "Tajawal",
  textTransform: "none",
  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    bgcolor: "#4f46e5",
    transform: "scale(1.03)",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
  },
});

export const menuPaperStyle = {
  sx: {
    mt: 2,
    backgroundColor: "#ffffff",
    backdropFilter: "blur(25px)",
    borderRadius: "16px",
    minWidth: "260px",
    p: 1.5,
    border: "1px solid rgba(5, 22, 48, 0.08)",
    boxShadow: "0 10px 40px rgba(5, 22, 48, 0.15)",
  },
};
