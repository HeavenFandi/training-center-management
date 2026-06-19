import { useState, useRef, useCallback } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema, TeacherFormData } from "../../validation/TeacherSchema";
import { useSnackbar } from "../../Context/SnackbarContext";

interface UseAddTeacherFormProps {
  onClose: () => void;
  onSave: (data: TeacherFormData & { cvFile: File | null }) => void;
}

export const useAddTeacherForm = ({ onClose, onSave }: UseAddTeacherFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    mode: "onChange",
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  }, []);

  const onSubmit = useCallback((data: TeacherFormData) => {
    onSave({ ...data, cvFile });
    reset();
    setCvFile(null);
    showSnackbar("تم إضافة المعلم بنجاح", "success");
    onClose();
  }, [cvFile, onClose, onSave, reset, showSnackbar]);

  const onError = useCallback((errors: FieldErrors<TeacherFormData>) => {
    console.log("Form validation errors:", errors);
    showSnackbar("يرجى التأكد من ملء جميع الحقول بشكل صحيح", "error");
  }, [showSnackbar]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    cvFile,
    fileInputRef,
    togglePasswordVisibility,
    handleFileChange,
    onSubmit,
    onError,
  };
};

