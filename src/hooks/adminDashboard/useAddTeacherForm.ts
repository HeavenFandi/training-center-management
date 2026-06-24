import { useState, useRef, useCallback } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema, AddTeacherFormData } from "../../validation/TeacherSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actCreateTeacher from "../../store/teachers/act/actCreateTeacher";
import actGetTeachers from "../../store/teachers/act/actGetTeachers";

interface UseAddTeacherFormProps {
  onClose: () => void;
  onSave?: (data: AddTeacherFormData & { cvFile: File | null }) => void;
}

export const useAddTeacherForm = ({ onClose, onSave }: UseAddTeacherFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTeacherFormData>({
    resolver: zodResolver(teacherSchema) as any,
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

  const onSubmit = useCallback(async (data: AddTeacherFormData) => {
    setIsSubmitting(true);
    try {
      // Convert CV file to base64 if present
      let cvBase64 = "";
      if (cvFile) {
        const reader = new FileReader();
        cvBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
      }

      const payload = {
        userId: user?.id || 0,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        specialization: data.specialization,
        certificates: data.certificates || "",
        address: data.address,
        cv: cvBase64,
        experienceYears: data.experienceYears,
      };

      console.log("Create teacher payload:", payload);

      const resultAction = await dispatch(actCreateTeacher(payload));

      if (actCreateTeacher.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        console.log("Create teacher response:", response);

        if (onSave) {
          onSave({ ...data, cvFile });
        }

        // Refresh teachers list
        dispatch(actGetTeachers());

        reset();
        setCvFile(null);
        showSnackbar("تم إضافة المعلم بنجاح", "success");
        onClose();
      } else {
        const errorMessage =
          typeof resultAction.payload === "string"
            ? resultAction.payload
            : "حدث خطأ أثناء إضافة المعلم";
        showSnackbar(errorMessage, "error");
      }
    } catch (error: any) {
      console.error("Error adding teacher:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إضافة المعلم";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [cvFile, onClose, onSave, reset, showSnackbar, dispatch, user]);

  const onError = useCallback((errors: FieldErrors<AddTeacherFormData>) => {
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

