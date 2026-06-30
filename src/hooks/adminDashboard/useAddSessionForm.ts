import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, SessionFormData } from "../../validation/SessionSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TSession } from "../../types/cardType";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CreateTrainingSessionRequest } from "../../api/trainingSessionApi";
import actGetLecturesBySessionId from "../../store/Courses/act/actGetLecturesBySessionId";
import actGetTrainingSessionDetails from "../../store/Courses/act/actGetTrainingSessionDetails";

// Map Arabic day names to English for API
const dayMap: Record<string, string> = {
  "الاثنين": "MONDAY",
  "الثلاثاء": "TUESDAY",
  "الأربعاء": "WEDNESDAY",
  "الخميس": "THURSDAY",
  "الأحد": "SUNDAY"
};

// Reverse map from English day names to Arabic for display
const reverseDayMap: Record<string, string> = {
  "MONDAY": "الاثنين",
  "TUESDAY": "الثلاثاء",
  "WEDNESDAY": "الأربعاء",
  "THURSDAY": "الخميس",
  "FRIDAY": "الجمعة",
  "SATURDAY": "السبت",
  "SUNDAY": "الأحد"
};

// Function to get English day name from a date string (YYYY-MM-DD)
const getDayNameFromDate = (dateStr: string): string | null => {
  const date = new Date(dateStr);
  const day = date.getUTCDay();
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ];
  return days[day] || null;
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
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  // selectedDays will hold Arabic day names for display
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const classrooms = useAppSelector((state) => state.classrooms.list);
  const sessionLectures = useAppSelector((state) => state.trainingSessions.sessionLectures);
  const selectedTrainingSession = useAppSelector((state) => state.trainingSessions.selectedTrainingSession);

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
      numberOfLectures: 0,
      duration: initialSession?.duration || "",
      status: initialSession?.status ? arabicToEnglishStatus[initialSession.status] : "UPCOMING",
      requiredEquipment: initialSession?.requiredEquipment || "",
      startDate: initialSession?.startDate || "",
      startTime: parseTimeToFormState(initialSession?.startTime),
      endTime: "10:00",
      daysOfWeek: [],
    },
  });

  // When initialSession is provided, fetch the latest training session details and lectures
  useEffect(() => {
    if (initialSession?.id) {
      // Fetch the latest training session details
      dispatch(actGetTrainingSessionDetails(initialSession.id));
      // Fetch lectures if we don't have them in the store
      if (!sessionLectures[initialSession.id]) {
        dispatch(actGetLecturesBySessionId(initialSession.id));
      }
    } else {
      // If no initialSession, reset to defaults
      setSelectedDays([]);
      setValue("numberOfLectures", 0, { shouldValidate: true });
      setValue("daysOfWeek", [], { shouldValidate: true });
      setValue("duration", "", { shouldValidate: true });
    }
  }, [initialSession?.id, dispatch, setValue]);

  // When selectedTrainingSession updates from fetch, update the form duration
  useEffect(() => {
    if (selectedTrainingSession && selectedTrainingSession.id === initialSession?.id) {
      // Update duration from the fetched selectedTrainingSession
      setValue("duration", selectedTrainingSession.duration, { shouldValidate: true });
      // Also update other fields from selectedTrainingSession if needed
      setValue("price", selectedTrainingSession.price, { shouldValidate: true });
      setValue("availableSeats", selectedTrainingSession.availableSeats, { shouldValidate: true });
      setValue("minSeats", selectedTrainingSession.minSeats, { shouldValidate: true });
      setValue("requiredEquipment", selectedTrainingSession.requiredEquipment, { shouldValidate: true });
    }
  }, [selectedTrainingSession, initialSession?.id, setValue]);

  // When sessionLectures updates for the initialSession.id, refresh the form
  useEffect(() => {
    if (initialSession?.id && sessionLectures[initialSession.id]) {
      const lectures = sessionLectures[initialSession.id];
      const freshNumberOfLectures = lectures.length;
      setValue("numberOfLectures", freshNumberOfLectures, { shouldValidate: true });

      // Extract unique days from lecture dates
      const uniqueEnglishDays = new Set<string>();
      lectures.forEach(lecture => {
        const englishDay = getDayNameFromDate(lecture.lectureDate);
        if (englishDay) {
          uniqueEnglishDays.add(englishDay);
        }
      });

      // Convert to Arabic days for display
      const arabicDays = Array.from(uniqueEnglishDays)
        .map(day => reverseDayMap[day])
        .filter(day => !!day); // Only keep days we have in our map

      // Update selectedDays state and form daysOfWeek
      setSelectedDays(arabicDays);
      const englishDaysForApi = arabicDays.map(day => dayMap[day]) as Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY">;
      setValue("daysOfWeek", englishDaysForApi, { shouldValidate: true });
    }
  }, [initialSession?.id, sessionLectures, setValue]);

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
