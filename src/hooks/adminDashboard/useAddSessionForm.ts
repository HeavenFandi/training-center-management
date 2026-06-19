import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionSchema, SessionFormData } from "../../validation/SessionSchema";
import { useSnackbar } from "../../Context/SnackbarContext";
import { TSession } from "../../types/cardType";

interface UseAddSessionFormProps {
  onClose: () => void;
  onSave: (sessionData: Omit<TSession, "id" | "lectures">) => void;
  initialSession?: TSession | null;
}

export const useAddSessionForm = ({ onClose, onSave, initialSession }: UseAddSessionFormProps) => {
  const { showSnackbar } = useSnackbar();
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSession?.days || []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    mode: "onChange",
    defaultValues: initialSession ? {
      courseId: initialSession.courseId,
      instructorId: initialSession.instructorId,
      semester: initialSession.semester,
      price: String(initialSession.price),
      availableSeats: String(initialSession.availableSeats),
      minCapacity: String(initialSession.minCapacity),
      sessionsCount: String(initialSession.sessionsCount),
      duration: initialSession.duration,
      status: initialSession.status,
      requiredEquipment: initialSession.requiredEquipment,
      startDate: initialSession.startDate,
      startTime: initialSession.startTime,
      endDate: initialSession.endDate,
      days: initialSession.days,
      image: initialSession.image || "",
    } : {
      courseId: 0,
      instructorId: 0,
      semester: "",
      price: "",
      availableSeats: "",
      minCapacity: "",
      sessionsCount: "",
      duration: "",
      status: "قيد الانتظار",
      requiredEquipment: "",
      startDate: "",
      startTime: "",
      endDate: "",
      days: [],
      image: "",
    },
  });


  useEffect(() => {
    if (initialSession) {
      reset({
        courseId: initialSession.courseId,
        instructorId: initialSession.instructorId,
        semester: initialSession.semester,
        price: String(initialSession.price),
        availableSeats: String(initialSession.availableSeats),
        minCapacity: String(initialSession.minCapacity),
        sessionsCount: String(initialSession.sessionsCount),
        duration: initialSession.duration,
        status: initialSession.status,
        requiredEquipment: initialSession.requiredEquipment,
        startDate: initialSession.startDate,
        startTime: initialSession.startTime,
        endDate: initialSession.endDate,
        days: initialSession.days,
        image: initialSession.image || "",
      });
      setSelectedDays(initialSession.days);
    } else {
      reset({
        courseId: 0,
        instructorId: 0,
        semester: "",
        price: "",
        availableSeats: "",
        minCapacity: "",
        sessionsCount: "",
        duration: "",
        status: "قيد الانتظار",
        requiredEquipment: "",
        startDate: "",
        startTime: "",
        endDate: "",
        days: [],
        image: "",
      });
      setSelectedDays([]);
    }
  }, [initialSession, reset]);

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prevDays) => {
      const newDays = prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];

      setValue("days", newDays, { shouldValidate: true });
      return newDays;
    });
  }, [setValue]);

  const onSubmit = useCallback((data: SessionFormData) => {
    
    
    
    
    onSave({
      title: `كورس - ${data.semester}`,
      courseId: data.courseId,
      instructorId: data.instructorId,
      semester: data.semester,
      price: Number(data.price),
      availableSeats: Number(data.availableSeats),
      minCapacity: Number(data.minCapacity),
      sessionsCount: Number(data.sessionsCount),
      duration: data.duration,
      status: data.status,
      requiredEquipment: data.requiredEquipment || "",
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      days: data.days,
      image: data.image,
      hall: data.semester, 
    });
    reset();
    setSelectedDays([]);
    showSnackbar("تم إنشاء الدورة بنجاح", "success");
    onClose();
  }, [onClose, onSave, reset, showSnackbar]);

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    selectedDays,
    toggleDay,
    onSubmit,
    watch,
  };
};

