export const labelSx = {
  fontFamily: "Tajawal",
  fontWeight: 700,
  fontSize: "15px",
  color: "#16263d",
  mb: 0.8,
  textAlign: "right" as const,
};

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    direction: "rtl",
    borderRadius: "999px",
    backgroundColor: "#ffffff",
    height: "44px",
    fontFamily: "Tajawal",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
    "& fieldset": {
      borderColor: "#edf1f5",
    },
    "&:hover fieldset": {
      borderColor: "#d9e1ea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1d304f",
    },
  },
  "& input": {
    textAlign: "right" as const,
    fontFamily: "Tajawal",
    fontSize: "13px",
    color: "#1f2f46",
    paddingRight: "14px",
  },
  "& input::placeholder": {
    color: "#9aa7b8",
    opacity: 1,
  },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    opacity: 0,
    display: "none",
  },
};
export const errorTextSx = {
  color: "#d32f2f",
  fontSize: "12px",
  fontFamily: "Tajawal",
  textAlign: "right" as const,
};

