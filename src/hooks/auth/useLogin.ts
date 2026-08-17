import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TSignInType } from "../../validation/SignInSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthLogin, resetAuthState } from "../../store/Auth/authSlice";
import { resetInstituteState } from "../../store/Institutes/institutesSlice";
import {
  actSendOtp,
  actVerifyOtp,
  resetOtpState,
} from "../../store/OTP/otpSlice";
import actGetInstituteByUserId from "../../store/Institutes/act/actGetInstituteByUserId";
import type { Institute } from "../../api/instituteApi";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loginLoading: loading, loginError: error } = useAppSelector(
    (state) => state.auth
  );

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

  // =========================
  // LOGIN FLOW (FIXED)
  // =========================
  const onsubmit = useCallback(
    async (data: TSignInType) => {
      try {
        dispatch(resetInstituteState());

        // 1. LOGIN
        const userData = await dispatch(actAuthLogin(data)).unwrap();

        let institute: Institute | null = null;

        // 2. FETCH INSTITUTE (ADMIN ONLY)
        if (userData.userType === "ADMIN") {
          try {
            // actGetInstituteByUserId already returns Institute | null (not array)
            institute = await dispatch(
              actGetInstituteByUserId(userData.id)
            ).unwrap();
          } catch (err) {
            if (import.meta.env.DEV) {
              console.warn("⚠️ Could not fetch institute (proceeding anyway):", err);
            }
            institute = null;
          }
        }

        const hasInstitute = !!institute?.id;

        // 3. NAVIGATION
        if (userData.userType === "ADMIN") {
          navigate(
            hasInstitute ? "/admin-dashboard" : "/institute-setup"
          );
        } else if (userData.userType === "TEACHER") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/main");
        }

        // 4. RESET AUTH
        dispatch(resetAuthState());
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("❌ useLogin onsubmit failed:", err);
        }
      }
    },
    [dispatch, navigate]
  );

  // =========================
  // OTP SEND SUCCESS
  // =========================
  useEffect(() => {
    if (sendSuccess) {
      setOpenModal(true);
      dispatch(resetOtpState());
    }
  }, [sendSuccess, dispatch]);

  // =========================
  // OTP VERIFY SUCCESS
  // =========================
  useEffect(() => {
    if (verifySuccess) {
      setOpenModal(false);
      navigate("/reset-password");
      dispatch(resetOtpState());
    }
  }, [verifySuccess, navigate, dispatch]);

  // =========================
  // OTP HANDLERS
  // =========================
  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const value = e.target.value;
      if (isNaN(Number(value))) return;

      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value.slice(-1);
        return newOtp;
      });

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(data)) return;

    const pasteData = data.slice(0, 6).split("");

    setOtp((prev) => {
      const newOtp = [...prev];
      pasteData.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      return newOtp;
    });
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
    [dispatch]
  );

  return {
    onsubmit,

    handleOtpChange,
    handleKeyDown,
    handlePaste,

    handleVerify,
    handleSendOtp,

    openModal,
    setOpenModal,

    otp,

    loading,
    error,

    sendLoading,
    sendError,

    verifyLoading,
    verifyError,
  };
};

export default useLogin;
