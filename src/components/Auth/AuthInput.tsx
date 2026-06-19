import React from "react";
import { Box, TextField, Typography } from "@mui/material";
type IInput = Omit<React.ComponentProps<typeof TextField>, "inputRef"> & {
  label: React.ReactNode;
  compact?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  children?: React.ReactNode;
};

const AuthInputComponent = React.forwardRef<HTMLInputElement, IInput>(function AuthInput({
  label,
  placeholder,
  type = "text",
  helperText,
  error,
  compact,
  select,
  multiline,
  children,
  inputRef,
  ...props
}, ref) {

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          fontSize: compact ? { xs: "0.7rem", md: "0.75rem" } : { xs: "0.8rem", md: "0.875rem" },
          mb: compact ? 0.1 : 0.3,
          textAlign: "right"
        }}
      >
        {label}
      </Typography>

      <TextField
        {...props}
        fullWidth
        type={type}
        multiline={multiline}
        placeholder={placeholder}
        error={error}
        helperText={helperText || " "}
        size={compact ? "small" : "medium"}
        select={select}
        children={children}
        inputRef={ref || inputRef}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            minHeight: compact ? { xs: "28px", md: "32px" } : { xs: "40px", md: "48px" },
            height: select || type === "date" || multiline ? "auto" : (compact ? { xs: "28px", md: "32px" } : { xs: "40px", md: "48px" }),
            backgroundColor: "transparent",
            fontSize: compact ? { xs: "0.75rem", md: "0.8rem" } : { xs: "0.9rem", md: "1rem" },
          },

          "& input": {
            backgroundColor: "transparent",
            py: compact ? { xs: "2px", md: "4px" } : { xs: "8px", md: "12px" },
            textAlign: "right"
          },

          "& textarea": {
            backgroundColor: "transparent",
            py: compact ? { xs: "2px", md: "4px" } : { xs: "8px", md: "12px" },
          },

          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px transparent inset",
            WebkitTextFillColor: "inherit",
            transition: "background-color 9999s ease-in-out 0s",
          },

          "& .MuiFormHelperText-root": {
            textAlign: "right",
            fontWeight: "bold",
            margin: 0,
            padding: "0 4px 0 0",
            height: compact ? "12px" : "20px",
            fontSize: compact ? "0.6rem" : "0.75rem",
            color: "#d32f2f",
            mt: 0.1
          },
        }}
      />
    </Box>
  );
});

const AuthInput = React.memo(AuthInputComponent);

export default AuthInput;


