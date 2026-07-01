import { z } from "zod";
import { Classroom } from "../api/classroomApi";

// Helper function to convert HH:mm to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
};

const WORK_START_MIN = 9 * 60; // 09:00 in minutes
const WORK_END_MIN = 17 * 60; // 17:00 in minutes

// Factory function to create schema with classrooms context
export const createSessionSchema = (classrooms: Classroom[], isEditMode: boolean = false) => {
  return z.object({
    courseId: z.number().int().min(1, "الكورس مطلوب"),
    teacherId: z.number().int().min(1, "المدرس مطلوب"),
    classroomId: z.number().int().min(1, "القاعة مطلوبة"),
    price: z.number().min(0, "السعر لا يقبل قيم سالبة").refine((val) => val >= 0, "السعر يجب أن يكون موجباً"),
    availableSeats: z.number().int().min(1, "المقاعد المتاحة مطلوبة").refine((val) => val > 0, "المقاعد المتاحة يجب أن تكون أكبر من 0"),
    minSeats: z.number().int().min(1, "الحد الأدنى للمقاعد مطلوب").refine((val) => val > 0, "الحد الأدنى للمقاعد يجب أن يكون أكبر من 0"),
    numberOfLectures: z.number().int().min(1, "عدد المحاضرات مطلوب").max(100, "عدد المحاضرات لا يمكن أن يتجاوز 100"),
    duration: z.string().min(1, "المدة مطلوبة"),
    status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED"]),
    requiredEquipment: z.string().optional(),
    startDate: z.string().min(1, "تاريخ البداية مطلوب").refine((dateStr) => {
      // If we're in edit mode, skip future date validation
      if (isEditMode) return true;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dateStr);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "تاريخ البداية يجب أن يكون اليوم أو في المستقبل"),
    startTime: z.string().min(1, "وقت البداية مطلوب").refine((time) => {
      const minutes = timeToMinutes(time);
      return minutes >= WORK_START_MIN;
    }, "وقت البداية يجب أن يكون بعد 09:00"),
    endTime: z.string().min(1, "وقت النهاية مطلوب").refine((time) => {
      const minutes = timeToMinutes(time);
      return minutes <= WORK_END_MIN;
    }, "وقت النهاية يجب أن يكون قبل 17:00"),
    daysOfWeek: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).min(1, "اختر يوما واحدا على الأقل"),
  }).superRefine((data, ctx) => {
    // Validate endTime is after startTime
    const startMin = timeToMinutes(data.startTime);
    const endMin = timeToMinutes(data.endTime);
    if (startMin >= endMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "وقت البداية يجب أن يكون قبل وقت النهاية",
        path: ["startTime"],
      });
    }

    // Validate availableSeats >= minSeats
    if (data.availableSeats < data.minSeats) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `المقاعد المتاحة يجب أن تكون أكبر من أو تساوي الحد الأدنى (${data.minSeats})`,
        path: ["availableSeats"],
      });
    }

    // Validate availableSeats <= classroom capacity
    const selectedClassroom = classrooms.find((c) => c.id === data.classroomId);
    if (selectedClassroom && data.availableSeats > selectedClassroom.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `عذراً، هذه القاعة تتسع لـ ${selectedClassroom.capacity} طلاب فقط!`,
        path: ["availableSeats"],
      });
    }
  });
};

// Default schema for backward compatibility (will be replaced by factory)
export const sessionSchema = createSessionSchema([]);

export type SessionFormData = z.infer<typeof sessionSchema>;
