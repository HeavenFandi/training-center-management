import { z } from "zod";

export const sessionSchema = z.object({
  courseId: z.number().min(1, "الكورس مطلوب"),
  instructorId: z.number().min(1, "المدرس مطلوب"),
  semester: z.string().min(1, "القاعة مطلوبة"),
  price: z.string().min(1, "السعر مطلوب"),
  availableSeats: z.string().min(1, "المقاعد المتاحة مطلوبة"),
  minCapacity: z.string().min(1, "الحد الأدنى للمقاعد مطلوب"),
  sessionsCount: z.string().min(1, "عدد الجلسات مطلوب"),
  duration: z.string().min(1, "المدة مطلوبة"),
  status: z.enum(["نشطة", "مكتملة", "قيد الانتظار"]),
  requiredEquipment: z.string().optional(),
  startDate: z.string().min(1, "تاريخ البداية مطلوب"),
  startTime: z.string().min(1, "وقت البداية مطلوب"),
  endDate: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  days: z.array(z.string()).min(1, "اختر يوما واحدا على الأقل"),
  image: z.string().optional(),
});

export type SessionFormData = z.infer<typeof sessionSchema>;

