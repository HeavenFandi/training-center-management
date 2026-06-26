import React from "react";
import { Button, SxProps, Theme } from "@mui/material";
interface IButton {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  sx?: SxProps<Theme>;
  disabled?: boolean;
}
const AuthButton = ({ children, type = "submit", sx, disabled }: IButton) => {


  return(
  <Button
    fullWidth
    variant="contained"
    size="large"
    type={type}
    disabled={disabled}
    sx={{
      py: 1.5,
   
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "1.1rem",
      boxShadow: "0 10px 20px rgba(5, 22, 48, 0.2)",
      textTransform: "none",
      ...sx
    }}
   
  >
    {children}
  </Button>
);}

export default AuthButton;


