import { z } from "zod";

// Helper function to convert HH:mm to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
};

const WORK_START_MIN = 9 * 60; // 09:00 in minutes
const WORK_END_MIN = 17 * 60; // 17:00 in minutes

export const sessionSchema = z.object({
  courseId: z.number().min(1, "الكورس مطلوب"),
  teacherId: z.number().min(1, "المدرس مطلوب"),
  classroomId: z.number().min(1, "القاعة مطلوبة"),
  price: z.number().min(0, "السعر مطلوب"),
  availableSeats: z.number().min(1, "المقاعد المتاحة مطلوبة"),
  minSeats: z.number().min(1, "الحد الأدنى للمقاعد مطلوب"),
  numberOfLectures: z.number().min(1, "عدد المحاضرات مطلوب"),
  duration: z.string().min(1, "المدة مطلوبة"),
  status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED"]),
  requiredEquipment: z.string().optional(),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  startTime: z.string().min(1, "وقت البداية مطلوب").refine((time) => {
    const minutes = timeToMinutes(time);
    return minutes >= WORK_START_MIN;
  }, "وقت البداية يجب أن يكون بعد 09:00"),
  endTime: z.string().min(1, "وقت النهاية مطلوب").refine((time) => {
    const minutes = timeToMinutes(time);
    return minutes <= WORK_END_MIN;
  }, "وقت النهاية يجب أن يكون قبل 17:00"),
  daysOfWeek: z.array(z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])).min(1, "اختر يوما واحدا على الأقل"),
}).refine((data) => {
  const startMin = timeToMinutes(data.startTime);
  const endMin = timeToMinutes(data.endTime);
  return startMin < endMin;
}, {
  message: "وقت البداية يجب أن يكون قبل وقت النهاية",
  path: ["startTime"],
});

export type SessionFormData = z.infer<typeof sessionSchema>;

