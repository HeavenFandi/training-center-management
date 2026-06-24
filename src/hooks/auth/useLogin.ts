import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TSignInType } from "../../validation/SignInSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthLogin, resetAuthState } from "../../store/Auth/authSlice";
import {
  actSendOtp,
  actVerifyOtp,
  resetOtpState,
} from "../../store/Otp/otpSlice";
import actGetInstituteByUserId from "../../store/Institutes/act/actGetInstituteByUserId";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    loginLoading: loading,
    loginError: error,
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

  const onsubmit = useCallback(
    async (data: TSignInType) => {
      try {
        const userData = await dispatch(actAuthLogin(data)).unwrap();
        console.log("Login success userData:", userData);
        console.log("Navigating userType:", userData.userType);

        if (userData.userType === "ADMIN") {
          const userId = userData.id;
          console.log("admin userId:", userId);
          const institute = await dispatch(actGetInstituteByUserId(userId)).unwrap();
          console.log("admin institute:", institute);
          if (institute) {
            navigate("/admin-dashboard");
          } else {
            navigate("/institute-setup");
          }
        } else if (userData.userType === "TEACHER") {
          navigate("/teacher-dashboard");
        } else if (userData.userType === "STUDENT") {
          navigate("/main");
        }
        dispatch(resetAuthState());
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
    [dispatch, navigate]
  );

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
