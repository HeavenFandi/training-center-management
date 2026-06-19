import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "اسم الكورس مطلوب"),
  hoursCount: z.string().min(1, "عدد الساعات مطلوب"),
  category: z.string().min(1, "التصنيف مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  requirements: z.string().min(1, "متطلبات الكورس مطلوبة"),
  image: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
