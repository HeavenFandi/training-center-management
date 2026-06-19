import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TSignInType } from "../../validation/SignInSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthLogin, resetAuthState } from "../../store/Auth/authSlice";
import {
  actSendOtp,
  actVerifyOtp,
  resetOtpState,
} from "../../store/OTP/otpSlice";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    loginLoading: loading,
    loginError: error,
    isAuthenticated,
    userType,
    user,
  } = useAppSelector((state) => state.auth);
  const {
    sendLoading,
    sendSuccess,
    sendError,
    verifyLoading,
    verifySuccess,
    verifyError,
  } = useAppSelector((state) => state.otp);

  const [openModal, setOpenModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [tempEmail, setTempEmail] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated && userType) {
      const currentPath = window.location.pathname;
      const setupComplete =
        Boolean(user?.tenantId || user?.instituteId || user?.institute) ||
        localStorage.getItem("instituteSetupDone") === "true";

      if (userType === "TEACHER") {
        navigate("/teacher-dashboard");
      } else if (userType === "ADMIN") {
        if (!setupComplete) {
          if (currentPath !== "/institute-setup") {
            navigate("/institute-setup");
          }
        } else if (!currentPath.startsWith("/admin-dashboard")) {
          navigate("/admin-dashboard");
        }
      } else {
        navigate("/main");
      }
      dispatch(resetAuthState());
    }
  }, [isAuthenticated, userType, user, navigate, dispatch]);

  useEffect(() => {
    if (sendSuccess) {
      console.log("[DEBUG useLogin] sendSuccess triggered!");
      setOpenModal(true);
      dispatch(resetOtpState());
    }
  }, [sendSuccess, dispatch]);

  useEffect(() => {
    if (verifySuccess) {
      console.log("[DEBUG useLogin] verifySuccess triggered!");
      setOpenModal(false);
      navigate("/reset-password");
      dispatch(resetOtpState());
    }
  }, [verifySuccess, navigate, dispatch]);

  const handleOtpChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number,
    ) => {
      const value = e.target.value;
      if (isNaN(Number(value))) return;
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value.substring(value.length - 1);
        return newOtp;
      });
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(data)) return;

    const pasteData = data.slice(0, 6).split("");

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      pasteData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      return newOtp;
    });

    const lastFocusIndex = Math.min(pasteData.length - 1, 5);
    document.getElementById(`otp-${lastFocusIndex}`)?.focus();
  }, []);

  const handleVerify = useCallback(() => {
    const code = otp.join("");
    if (code.length === 6 && tempEmail) {
      dispatch(actVerifyOtp({ email: tempEmail, code }));
    }
  }, [otp, tempEmail, dispatch]);

  const handleSendOtp = useCallback(
    (email: string) => {
      setTempEmail(email);
      localStorage.setItem("otpEmail", email);
      dispatch(actSendOtp(email));
    },
    [dispatch],
  );

  const onsubmit = useCallback(
    (data: TSignInType) => {
      dispatch(actAuthLogin({ email: data.email, password: data.password }));
    },
    [dispatch],
  );

  return {
    handleKeyDown,
    handleOtpChange,
    handlePaste,
    handleVerify,
    openModal,
    setOpenModal,
    otp,
    onsubmit,
    loading,
    error,
    handleSendOtp,
    sendLoading,
    sendError,
    verifyLoading,
    verifyError,
  };
};
export default useLogin;
