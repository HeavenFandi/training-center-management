import { useState, useRef, useCallback } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentFormData } from "../../validation/StudentSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { CreateStudentResponse } from "../../api/studentApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actCreateStudent from "../../store/Students/act/actCreateStudent";

interface UseAddStudentFormProps {
  onClose: () => void;
  onAdd?: (data: CreateStudentResponse) => void;
}

export const useAddStudentForm = ({
  onClose,
  onAdd,
}: UseAddStudentFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute } = useAppSelector((state) => state.institutes);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactInfo: "",
      gender: "ذكر",
      birthDate: "",
      address: "",
      interest: "",
      // Always initialize bio as a string so it is never undefined or null
      bio: "",
      image: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setImageFile(e.target.files[0]);
      }
    },
    [],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: StudentFormData) => {
      setIsSubmitting(true);
      try {
        // Strict Payload Logging
        console.log("Current Auth Context Info:", {
          user,
          institute: currentInstitute,
          tenant: currentInstitute?.tenantId,
        });

        // Convert image file to base64 if present
        let imageBase64 = "";
        if (imageFile) {
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });
        }

        const payload = {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          contactInfo: data.contactInfo,
          image: imageBase64,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          birthDate: data.birthDate,
          address: data.address,
          interest: data.interest,
          bio: data.bio,
          enrollmentDate:
            data.enrollmentDate ?? new Date().toISOString().split("T")[0],
          tenantId: currentInstitute?.tenantId,
          instituteId: currentInstitute?.id,
        };

        console.log("Exact Create Student Payload Sent to API:", payload);

        const resultAction = await dispatch(actCreateStudent(payload));

        if (actCreateStudent.fulfilled.match(resultAction)) {
          const response = resultAction.payload;
          console.log("Create student response:", response);

          if (onAdd) {
            onAdd(response);
          }

          reset();
          setImageFile(null);
          showSnackbar("تمت إضافة الطالب بنجاح", "success");
          onClose();
        } else {
          const errorMessage =
            typeof resultAction.payload === "string"
              ? resultAction.payload
              : "حدث خطأ أثناء إضافة الطالب";
          showSnackbar(errorMessage, "error");
        }
      } catch (error: any) {
        console.error("Error adding student:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء إضافة الطالب";
        showSnackbar(errorMessage, "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      imageFile,
      onAdd,
      onClose,
      reset,
      showSnackbar,
      dispatch,
      user,
      currentInstitute,
    ],
  );

  const onError = useCallback(
    (errors: FieldErrors<StudentFormData>) => {
      console.log("Form validation errors:", errors);
      showSnackbar("يرجى التأكد من ملء جميع الحقول بشكل صحيح", "error");
    },
    [showSnackbar],
  );

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    imageFile,
    fileInputRef,
    dateInputRef,
    handleImageChange,
    togglePasswordVisibility,
    onSubmit,
    onError,
  };
};
