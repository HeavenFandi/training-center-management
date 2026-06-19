import { useState, useRef, useCallback } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormData } from "../../validation/CourseSchema";
import { useSnackbar } from "../../Context/SnackbarContext";

interface UseAddCourseFormProps {
  onClose: () => void;
  onSave: (data: CourseFormData) => void;
}

export const useAddCourseForm = ({ onClose, onSave }: UseAddCourseFormProps) => {
  const { showSnackbar } = useSnackbar();
  const [courseImage, setCourseImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
 
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setCourseImage(base64String);
          setValue("image", base64String);
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue]
  );

  const onSubmit = useCallback(
    (data: CourseFormData) => {
      onSave(data);
      showSnackbar("تم إضافة الكورس بنجاح", "success");
      onClose();
    },
    [onSave, showSnackbar, onClose]
  );

  const onError = useCallback(
    (errors: FieldErrors<CourseFormData>) => {
      console.log("Form validation errors:", errors);
      showSnackbar("يرجى التأكد من ملء جميع الحقول", "error");
    },
    [showSnackbar]
  );

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    onError,
    courseImage,
    fileInputRef,
    handleFileChange,
  };
};

