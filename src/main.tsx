import { createTheme, ThemeProvider } from "@mui/material/styles";
import { store } from "./store/index";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./Routes/AppRouter";
import "./index.css";
import { SnackbarProvider } from "./Context/SnackbarContext";
import { NotificationsProvider } from "./Context/NotificationsContext";
import { Provider, useDispatch } from "react-redux";
import { setHydrated } from "./store/Auth/authSlice";

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
      default: "#F6FAFD",
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

const RootComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHydrated());
  }, [dispatch]);

  return <AppRouter />;
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <NotificationsProvider>
          <RootComponent />
        </NotificationsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);
