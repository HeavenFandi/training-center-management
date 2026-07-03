import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSessionSchema, SessionFormData } from "../../validation/SessionSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TSession } from "../../types/cardType";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CreateTrainingSessionRequest, convertTimeStringToTimeObject } from "../../api/trainingSessionApi";
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

import { TeacherApiResponse } from "../../api/teacherApi";

interface UseAddSessionFormProps {
  onClose: () => void;
  onSave: (sessionData: CreateTrainingSessionRequest, imageFile: File | null) => void;
  initialSession?: TSession | null;
  courseId?: number;
  teachers: TeacherApiResponse[];
}

// Helper function to format any date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: any): string => {
  let dateObj: Date;
  if (!date) {
    dateObj = new Date();
  } else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "string") {
    dateObj = new Date(date);
    // Handle cases where date might be in a different format
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }
  } else {
    dateObj = new Date();
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to extract ID from a nested object (e.g., teacher.id, classroom.id)
const extractId = (data: any): number => {
  if (!data) return 0;
  if (typeof data === "number") return data;
  if (typeof data === "object") {
    // Check for common ID properties
    if (data.id) return data.id;
    if (data.teacherId) return data.teacherId;
    if (data.classroomId) return data.classroomId;
    if (data.hallId) return data.hallId;
    if (data.instructorId) return data.instructorId;
  }
  return 0;
};

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
  if (!time) return "";
  
  // If time is a string (already "HH:mm" or "HH:mm:ss")
  if (typeof time === "string") {
    const parts = time.split(":");
    const hour = parts[0]?.padStart(2, "0");
    const minute = parts[1]?.padStart(2, "0");
    if (hour && minute) {
      return `${hour}:${minute}`;
    }
    return "";
  }
  
  // If time is an object with hour and minute
  if (typeof time === "object" && time !== null && "hour" in time && "minute" in time) {
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  }
  
  return "";
};

// Helper to add hours to a time string (HH:mm)
const addHoursToTime = (timeStr: string, hours: number): string => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const newHour = (hour + hours) % 24;
  return `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

export const useAddSessionForm = ({ onClose, onSave, initialSession, courseId, teachers }: UseAddSessionFormProps) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  // selectedDays will hold Arabic day names for display
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classrooms = useAppSelector((state) => state.classrooms.list);
  const sessionLectures = useAppSelector((state) => state.trainingSessions.sessionLectures);
  const selectedTrainingSession = useAppSelector((state) => state.trainingSessions.selectedTrainingSession);
  const trainingSessionsList = useAppSelector((state) => state.trainingSessions.trainingSessions);
  const isLoadingSessionDetails = useAppSelector((state) => state.trainingSessions.sessionDetailsLoading === "pending");
  const isEditMode = !!initialSession;

  // Create schema with classrooms context using useMemo to prevent recreation
  const sessionSchema = useMemo(() => createSessionSchema(classrooms, isEditMode), [classrooms, isEditMode]);

  // Initialize default values based on whether we're in edit mode or not
  const defaultValues = useMemo((): SessionFormData => {
    if (initialSession) {
      // Edit mode: use initialSession data
      return {
        courseId: courseId || initialSession.courseId || 0,
        teacherId: 0, // Will be set later via useEffect
        classroomId: 0, // Will be set later via useEffect
        price: initialSession.price || 0,
        availableSeats: initialSession.availableSeats || 0,
        minSeats: initialSession.minCapacity || 0,
        numberOfLectures: 0,
        status: initialSession.status ? (["UPCOMING", "ACTIVE", "COMPLETED"].includes(initialSession.status) ? initialSession.status as "UPCOMING" | "ACTIVE" | "COMPLETED" : arabicToEnglishStatus[initialSession.status]) : "UPCOMING",
        requiredEquipment: initialSession.requiredEquipment || "",
        startDate: initialSession.startDate ? formatDateToYYYYMMDD(initialSession.startDate) : "",
        startTime: parseTimeToFormState(initialSession.startTime),
        endTime: parseTimeToFormState(initialSession.endTime),
        daysOfWeek: (initialSession.days || []).map(day => reverseDayMap[day] || undefined).filter(Boolean) as ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] || [],
      };
    } else {
      // New mode: completely empty
      return {
        courseId: courseId || 0,
        teacherId: 0,
        classroomId: 0,
        price: 0,
        availableSeats: 0,
        minSeats: 0,
        numberOfLectures: 0,
        status: "UPCOMING",
        requiredEquipment: "",
        startDate: "",
        startTime: "",
        endTime: "",
        daysOfWeek: [],
      };
    }
  }, [initialSession, courseId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues,
    control,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // Watch classroomId to auto-set requiredEquipment
  const watchedClassroomId = watch("classroomId");
  
  // Get selected classroom based on watchedClassroomId
  const selectedClassroom = useMemo(() => {
    return classrooms.find(c => c.id === watchedClassroomId);
  }, [classrooms, watchedClassroomId]);

  // Auto-set requiredEquipment when selectedClassroom changes
  useEffect(() => {
    if (selectedClassroom) {
      setValue("requiredEquipment", selectedClassroom.availableDevices, { shouldValidate: false });
    }
  }, [selectedClassroom, setValue]);

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
      setValue("numberOfLectures", 0, { shouldValidate: false });
      setValue("daysOfWeek", [], { shouldValidate: false });
    }
  }, [initialSession?.id, dispatch, setValue]);

  // When selectedTrainingSession updates from fetch, update all form fields
  useEffect(() => {
    if (selectedTrainingSession && selectedTrainingSession.id === initialSession?.id && teachers.length > 0 && classrooms.length > 0) {
      // First get the full session from trainingSessionsList to get teacherId and classroomId
      const fullSession = trainingSessionsList.find(s => s.id === selectedTrainingSession.id);
      
      // Get teacherId - extract from nested objects if needed
      let teacherId = extractId(selectedTrainingSession.teacherId) ?? 
                     extractId(fullSession?.teacherId) ?? 
                     extractId(initialSession?.teacherId) ?? 
                     extractId((selectedTrainingSession as any).teacher) ?? 
                     extractId((fullSession as any)?.teacher) ?? 
                     extractId((initialSession as any)?.teacher);
      if (!teacherId || !teachers.some(t => t.id === teacherId)) {
        teacherId = teachers[0]?.id ?? 0;
      }
      
      // Get classroomId - extract from nested objects if needed
      let classroomId = extractId(selectedTrainingSession.classroomId) ?? 
                       extractId(fullSession?.classroomId) ?? 
                       extractId(initialSession?.classroomId) ?? 
                       extractId((selectedTrainingSession as any).classroom) ?? 
                       extractId((fullSession as any)?.classroom) ?? 
                       extractId((initialSession as any)?.hall);
      if (!classroomId || !classrooms.some(c => c.id === classroomId)) {
        classroomId = classrooms[0]?.id ?? 0;
      }
      
      // Get status
      let status = "UPCOMING";
      const sessionStatus = selectedTrainingSession.status;
      if (sessionStatus) {
        // Check if the status is already in English
        if (["UPCOMING", "ACTIVE", "COMPLETED"].includes(sessionStatus)) {
          status = sessionStatus as "UPCOMING" | "ACTIVE" | "COMPLETED";
        } else {
          // Try to convert from Arabic
          status = arabicToEnglishStatus[sessionStatus] || "UPCOMING";
        }
      }
      
      // Format start date
      const formattedStartDate = formatDateToYYYYMMDD(selectedTrainingSession.startDate);
      
      // Get and fix times
      const parsedStartTime = parseTimeToFormState(selectedTrainingSession.startTime ?? initialSession?.startTime);
      let parsedEndTime = parseTimeToFormState(selectedTrainingSession.endTime ?? initialSession?.endTime);
      
      // If end time is same as start time, add 2 hours
      if (parsedStartTime === parsedEndTime) {
        parsedEndTime = addHoursToTime(parsedStartTime, 2);
      }
      
      // Update form fields
      setValue("teacherId", teacherId, { shouldValidate: false });
      setValue("classroomId", classroomId, { shouldValidate: false });
      setValue("status", status as "UPCOMING" | "ACTIVE" | "COMPLETED", { shouldValidate: false });
      setValue("price", selectedTrainingSession.price, { shouldValidate: false });
      setValue("availableSeats", selectedTrainingSession.availableSeats, { shouldValidate: false });
      setValue("minSeats", selectedTrainingSession.minSeats, { shouldValidate: false });
      setValue("requiredEquipment", selectedTrainingSession.requiredEquipment, { shouldValidate: false });
      setValue("startDate", formattedStartDate, { shouldValidate: false });
      setValue("startTime", parsedStartTime, { shouldValidate: false });
      setValue("endTime", parsedEndTime, { shouldValidate: false });
      
      // Also set days from selectedTrainingSession if available
      if (selectedTrainingSession.daysOfWeek) {
        const arabicDays = selectedTrainingSession.daysOfWeek.map((day: string) => reverseDayMap[day]).filter(Boolean);
        setSelectedDays(arabicDays);
        setValue("daysOfWeek", selectedTrainingSession.daysOfWeek as Array<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY">, { shouldValidate: false });
      }
    }
  }, [selectedTrainingSession, initialSession?.id, teachers, classrooms, trainingSessionsList, setValue]);

  // When sessionLectures updates for the initialSession.id, refresh the form
  useEffect(() => {
    if (initialSession?.id && sessionLectures[initialSession.id]) {
      const lectures = sessionLectures[initialSession.id];
      const freshNumberOfLectures = lectures.length;
      setValue("numberOfLectures", freshNumberOfLectures, { shouldValidate: false });

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
      setValue("daysOfWeek", englishDaysForApi, { shouldValidate: false });
    }
  }, [initialSession?.id, sessionLectures, setValue]);



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
      setValue("daysOfWeek", newEnglishDays, { shouldValidate: false });
      return newArabicDays;
    });
  }, [setValue]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("يرجى اختيار ملف صورة صالح");
        return;
      }
      setImageError(null);
      setSelectedImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  const clearImage = useCallback(() => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const onSubmit = useCallback((data: SessionFormData) => {
    // Convert times to "HH:mm:ss" strings
    const apiData: CreateTrainingSessionRequest = {
      ...data,
      status: !initialSession ? "UPCOMING" : data.status, // Hardcode to UPCOMING when adding new
      startTime: formatTimeForApi(data.startTime),
      endTime: formatTimeForApi(data.endTime),
      requiredEquipment: data.requiredEquipment || "",
    };
    console.log("Submitting session data to API:", apiData);
    onSave(apiData, selectedImageFile);
    // Don't close the modal automatically - let the parent decide based on success/conflict
  }, [onSave, initialSession, selectedImageFile]);

  const handleTimeChange = (field: "startTime" | "endTime", timeStr: string) => {
    setValue(field, timeStr, { shouldValidate: false });
  };

  // Override the reset to also reset selectedDays and image state
  const resetSelectedDays = useCallback(() => {
    if (initialSession) {
      // Edit mode: reset to initialSession days
      const days = initialSession.days || [];
      const arabicDays = days.map((day: string) => reverseDayMap[day] || day).filter(Boolean);
      setSelectedDays(arabicDays);
    } else {
      // New mode: clear all days
      setSelectedDays([]);
    }
  }, [initialSession]);

  const resetWithDays = useCallback((values?: Partial<SessionFormData>) => {
    // Reset form
    if (values) {
      reset(values);
    } else {
      reset(defaultValues);
    }
    // Reset days
    resetSelectedDays();
    // Reset image state
    setSelectedImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [reset, resetSelectedDays, defaultValues]);

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
    handleTimeChange,
    classrooms,
    reset: resetWithDays,
    getValues,
    selectedImageFile,
    imagePreview,
    imageError,
    fileInputRef,
    handleFileChange,
    clearImage,
    isLoadingSessionDetails,
    selectedTrainingSession,
    selectedClassroom,
  };
};
