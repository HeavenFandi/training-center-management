import { createTheme, ThemeProvider } from "@mui/material/styles";
import { store } from "./store/index";
import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./Routes/AppRouter";
import "./index.css";
import { SnackbarProvider } from "./Context/SnackbarContext";
import { NotificationsProvider } from "./Context/NotificationsContext";
import { Provider } from "react-redux";
const theme = createTheme({
  typography: {
    fontFamily: "Tajawal, sans-serif",
  },
  palette: {
    primary: {
      main: "#0A1931",
    },
    secondary: {
      main: "#134980",
    },
    background: {
      default: "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 100%)",
    },
  },
  components: {
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: "md",
      },
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          padding: "0px", 
          "@media (max-width: 600px)": {
            margin: "12px",
            width: "calc(100% - 24px)",
            borderRadius: "16px",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          "@media (max-width: 600px)": {
            padding: "16px",
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      },
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <NotificationsProvider>
      <Provider store={store}>
        <AppRouter />
        </Provider>
      </NotificationsProvider>
    </SnackbarProvider>
  </ThemeProvider>,
);


