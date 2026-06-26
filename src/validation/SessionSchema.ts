import { z } from "zod";

// Helper function to convert HH:mm to minutes since midnight
export const timeToMinutes = (timeStr: string): number => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
};

// Function to create a dynamic session schema based on institute data
export const createSessionSchema = (institute?: {
  startTime?: string;
  endTime?: string;
  workingDays?: string[];
}) => {
  // Helper to parse time from institute (could be "HH:mm" or object)
  const parseInstituteTime = (time: any): string => {
    if (!time) return "00:00";
    if (typeof time === "string") {
      const parts = time.split(":");
      return `${parts[0]?.padStart(2, "0") || "00"}:${parts[1]?.padStart(2, "0") || "00"}`;
    }
    if (typeof time === "object" && time !== null && "hour" in time && "minute" in time) {
      return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
    }
    return "00:00";
  };

  const instituteStartTime = parseInstituteTime(institute?.startTime);
  const instituteEndTime = parseInstituteTime(institute?.endTime);
  const instituteStartMin = timeToMinutes(instituteStartTime);
  const instituteEndMin = timeToMinutes(instituteEndTime);
  const workingDaysSet = new Set(institute?.workingDays || []);

  return z.object({
    courseId: z.number().min(1, "الكورس مطلوب"),
    teacherId: z.number().min(1, "المدرس مطلوب"),
    classroomId: z.number().min(1, "القاعة مطلوبة"),
    price: z.number().min(0, "السعر مطلوب"),
    availableSeats: z.number().min(1, "المقاعد المتاحة مطلوبة"),
    minSeats: z.number().min(1, "الحد الأدنى للمقاعد مطلوب"),
    numberOfLectures: z.number().min(1, "عدد الجلسات مطلوب"),
    duration: z.string().min(1, "المدة مطلوبة"),
    status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED"]),
    requiredEquipment: z.string().optional(),
    startDate: z.string().min(1, "تاريخ البداية مطلوب"),
    startTime: z.string().min(1, "وقت البداية مطلوب").refine((time) => {
      if (!institute?.startTime) return true;
      const minutes = timeToMinutes(time);
      return minutes >= instituteStartMin;
    }, (time) => {
      if (!institute?.startTime) {
        return { message: "لا توجد أوقات عمل للمعهد محددة" };
      }
      return { message: `وقت البداية يجب أن يكون بعد ${instituteStartTime}` };
    }),
    endTime: z.string().min(1, "وقت النهاية مطلوب").refine((time) => {
      if (!institute?.endTime) return true;
      const minutes = timeToMinutes(time);
      return minutes <= instituteEndMin;
    }, (time) => {
      if (!institute?.endTime) {
        return { message: "لا توجد أوقات عمل للمعهد محددة" };
      }
      return { message: `وقت النهاية يجب أن يكون قبل ${instituteEndTime}` };
    }),
    daysOfWeek: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).min(1, "اختر يوما واحدا على الأقل").refine((days) => {
      if (!institute?.workingDays || institute.workingDays.length === 0) return true;
      return days.every((day) => workingDaysSet.has(day));
    }, (days) => {
      if (!institute?.workingDays || institute.workingDays.length === 0) {
        return { message: "لا توجد أيام عمل للمعهد محددة" };
      }
      return { message: "بعض الأيام المختارة ليست ضمن أيام عمل المعهد" };
    }),
  }).refine((data) => {
    const startMin = timeToMinutes(data.startTime);
    const endMin = timeToMinutes(data.endTime);
    return startMin < endMin;
  }, {
    message: "وقت البداية يجب أن يكون قبل وقت النهاية",
    path: ["startTime"],
  });
};

// Default schema for backward compatibility
export const sessionSchema = createSessionSchema();
export type SessionFormData = z.infer<typeof sessionSchema>;

