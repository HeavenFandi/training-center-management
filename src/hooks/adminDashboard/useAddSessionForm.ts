import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, SessionFormData } from "../../validation/SessionSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TSession } from "../../types/cardType";
import { useAppSelector } from "../../store/hooks";
import { CreateTrainingSessionRequest } from "../../api/trainingSessionApi";

// Map Arabic day names to English for API
const dayMap: Record<string, string> = {
  "الاثنين": "MONDAY",
  "الثلاثاء": "TUESDAY",
  "الأربعاء": "WEDNESDAY",
  "الخميس": "THURSDAY",
  "الأحد": "SUNDAY"
};

// Map Arabic status to English for form/API
const arabicToEnglishStatus: Record<string, "UPCOMING" | "ACTIVE" | "COMPLETED"> = {
  "قيد الانتظار": "UPCOMING",
  "نشطة": "ACTIVE",
  "مكتملة": "COMPLETED"
};

// Map English status to Arabic for TSession
const englishToArabicStatus: Record<string, string> = {
  "UPCOMING": "قيد الانتظار",
  "ACTIVE": "نشطة",
  "COMPLETED": "مكتملة"
};

interface UseAddSessionFormProps {
  onClose: () => void;
  onSave: (sessionData: CreateTrainingSessionRequest) => void;
  initialSession?: TSession | null;
  courseId?: number;
}

// Convert "HH:mm" to "HH:mm:ss" for LocalTime
const formatTimeForApi = (timeStr: string) => {
  if (!timeStr) return "00:00:00";
  const parts = timeStr.split(":");
  const hour = parts[0]?.padStart(2, "0") || "00";
  const minute = parts[1]?.padStart(2, "0") || "00";
  return `${hour}:${minute}:00`;
};

// Helper to convert any time value (string or object) to "HH:mm" for form state
const parseTimeToFormState = (time: any): string => {
  if (!time) return "09:00";
  
  // If time is a string (already "HH:mm" or "HH:mm:ss")
  if (typeof time === "string") {
    const parts = time.split(":");
    return `${parts[0]?.padStart(2, "0") || "09"}:${parts[1]?.padStart(2, "0") || "00"}`;
  }
  
  // If time is an object with hour and minute
  if (typeof time === "object" && time !== null && "hour" in time && "minute" in time) {
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  }
  
  return "09:00";
};

export const useAddSessionForm = ({ onClose, onSave, initialSession, courseId }: UseAddSessionFormProps) => {
  const { showSnackbar } = useSnackbar();
  // selectedDays will hold Arabic day names for display
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSession?.days || []);
  const classrooms = useAppSelector((state) => state.classrooms.list);

  // Create schema with classrooms context using useMemo to prevent recreation
  const sessionSchema = useMemo(() => createSessionSchema(classrooms), [classrooms]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    mode: "onChange",
    defaultValues: {
      courseId: courseId || 0,
      teacherId: 0,
      classroomId: 0,
      price: initialSession?.price || 0,
      availableSeats: initialSession?.availableSeats || 0,
      minSeats: initialSession?.minCapacity || 0,
      numberOfLectures: initialSession?.sessionsCount || 0,
      duration: initialSession?.duration || "",
      status: initialSession?.status ? arabicToEnglishStatus[initialSession.status] : "UPCOMING",
      requiredEquipment: initialSession?.requiredEquipment || "",
      startDate: initialSession?.startDate || "",
      startTime: parseTimeToFormState(initialSession?.startTime),
      endTime: "10:00",
      daysOfWeek: [],
    },
  });

  // When classrooms are available, set classroomId to first available if it's still 0
  useEffect(() => {
    if (classrooms.length > 0 && watch("classroomId") === 0) {
      setValue("classroomId", classrooms[0].id, { shouldValidate: true });
    }
  }, [classrooms, watch, setValue]);

  useEffect(() => {
    if (courseId) {
      setValue("courseId", courseId);
    }
  }, [courseId, setValue]);

  const toggleDay = useCallback((arabicDay: string) => {
    setSelectedDays((prevArabicDays) => {
      const newArabicDays = prevArabicDays.includes(arabicDay)
        ? prevArabicDays.filter((d) => d !== arabicDay)
        : [...prevArabicDays, arabicDay];

      // Convert Arabic days to English for the API
      const newEnglishDays = newArabicDays.map((d) => dayMap[d]) as Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY">;

      console.log("Toggling day:", arabicDay, "New Arabic days:", newArabicDays, "New English days:", newEnglishDays);
      setValue("daysOfWeek", newEnglishDays, { shouldValidate: true });
      return newArabicDays;
    });
  }, [setValue]);

  const onSubmit = useCallback((data: SessionFormData) => {
    // Convert times to LocalTime format "HH:mm:ss"
    const apiData: CreateTrainingSessionRequest = {
      ...data,
      startTime: formatTimeForApi(data.startTime),
      endTime: formatTimeForApi(data.endTime),
      requiredEquipment: data.requiredEquipment || "",
    };
    console.log("Submitting session data to API:", apiData);
    onSave(apiData);
    // Don't close the modal automatically - let the parent decide based on success/conflict
  }, [onSave]);

  const handleTimeChange = (field: "startTime" | "endTime", timeStr: string) => {
    setValue(field, timeStr, { shouldValidate: true });
  };

  // Override the reset to also reset selectedDays
  const resetSelectedDays = useCallback(() => {
    setSelectedDays(initialSession?.days || []);
  }, [initialSession]);

  const resetWithDays = useCallback((values?: Partial<SessionFormData>) => {
    reset(values);
    resetSelectedDays();
  }, [reset, resetSelectedDays]);

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
    handleTimeChange,
    classrooms,
    reset: resetWithDays,
    getValues,
  };
};
