import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, type SignUpType } from "../../validation/SingUpSchema";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthRegister, resetAuthState } from "../../store/Auth/authSlice";
import { useSnackbar } from "../../Context/SnackbarContext";

export default function useRegisterForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const {
    registerLoading: loading,
    registerError: error,
    registerSuccess: success,
  } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadProgress] = useState(0);
  const [isUploading] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      address: "",
      phoneNumber: "",
      gender: "ذكر",
      bio: "",
      profileImage: undefined,
    },
  });

  useEffect(() => {
    if (success) {
      showSnackbar("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول", "success");
      navigate("/", {
        state: { message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن" },
      });
      dispatch(resetAuthState());
      setGenericError(null);
      clearErrors();
    }
  }, [success, navigate, dispatch, showSnackbar, clearErrors]);

  useEffect(() => {
    if (error) {
      if (typeof error === "string") {
        setGenericError(error);
      } else if (typeof error === "object") {
        setGenericError(null);
        Object.entries(error).forEach(([field, messages]) => {
          let formField = field as keyof SignUpType;
          if (field === "profilePicture") formField = "profileImage";
          if (field === "contactInfo") formField = "phoneNumber";
          
          if (Array.isArray(messages) && messages.length > 0) {
            setError(formField, { message: messages[0] });
          }
        });
      }
    } else {
      setGenericError(null);
    }
  }, [error, setError]);

  const handleChooseImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file) {
        setImageFile(file);
        setValue("profileImage", file, { shouldValidate: true });
      } else {
        setImageFile(null);
        setValue("profileImage", undefined, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const onSubmit = useCallback(
    (data: SignUpType) => {
      setGenericError(null);
      clearErrors();
      dispatch(actAuthRegister(data));
    },
    [dispatch, clearErrors],
  );

  return {
    fileInputRef,
    dateInputRef,
    imageFile,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleChooseImage,
    handleImageChange,
    register,
    handleSubmit,
    errors,
    onSubmit,
    uploadProgress,
    isUploading,
    control,
    loading,
    genericError,
  };
}
