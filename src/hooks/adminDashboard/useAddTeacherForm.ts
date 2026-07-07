import { useState, useCallback } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teacherSchema,
  AddTeacherFormData,
} from "../../validation/TeacherSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actCreateTeacher from "../../store/teachers/act/actCreateTeacher";
import actGetTeachersByInstituteId from "../../store/teachers/act/actGetTeachersByInstituteId";
import actAssignTeacherToInstitute from "../../store/teachers/act/actAssignTeacherToInstitute";

interface UseAddTeacherFormProps {
  onClose: () => void;
  onSave?: (data: AddTeacherFormData) => void;
}

export const useAddTeacherForm = ({
  onClose,
  onSave,
}: UseAddTeacherFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
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
  } = useForm<AddTeacherFormData>({
    resolver: zodResolver(teacherSchema) as any,
    mode: "onChange",
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: AddTeacherFormData) => {
      setIsSubmitting(true);
      try {
        if (!currentInstitute || !currentInstitute.id) {
          showSnackbar("لم يتم العثور على المعهد", "error");
          return;
        }

        const payload = {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          specialization: data.specialization,
          address: data.address,
          experienceYears: data.experienceYears,
        };

        if (import.meta.env.DEV) {
          console.log("Create teacher payload:", payload);
        }

        const resultAction = await dispatch(actCreateTeacher(payload));

        if (actCreateTeacher.fulfilled.match(resultAction)) {
          const createdTeacher = resultAction.payload;
          if (import.meta.env.DEV) {
            console.log("Create teacher response:", createdTeacher);
          }

          // Assign teacher to institute
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const assignResult = await dispatch(actAssignTeacherToInstitute({
            instituteId: currentInstitute.id,
            teacherId: createdTeacher.id,
            status: "ACTIVE",
            joinedDate: today,
          }));

          if (!actAssignTeacherToInstitute.fulfilled.match(assignResult)) {
            const errorMsg =
              typeof assignResult.payload === "string"
                ? assignResult.payload
                : "حدث خطأ أثناء ربط المعلم بالمعهد";
            showSnackbar(errorMsg, "error");
            return;
          }

          if (onSave) {
            onSave(data);
          }

          // Refresh teachers list (only for this institute)
          dispatch(actGetTeachersByInstituteId(currentInstitute.id));

          reset();
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
        if (import.meta.env.DEV) {
          console.error("Error adding teacher:", error);
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء إضافة المعلم";
        showSnackbar(errorMessage, "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, onSave, reset, showSnackbar, dispatch, currentInstitute],
  );

  const onError = useCallback(
    (errors: FieldErrors<AddTeacherFormData>) => {
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
    togglePasswordVisibility,
    onSubmit,
    onError,
  };
};
