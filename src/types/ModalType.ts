import React from "react";
export interface TVerifyModalProps {
  open: boolean;
  onClose: () => void;
  otp: string[];
  handleOtpChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
}
export interface SuccessModalProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  message: string;
  buttonText: string;
  navigateTo: string;
}
