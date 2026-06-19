import { z } from "zod";

export const courseSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "اسم الكورس مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  requirements: z.string().min(1, "المتطلبات مطلوبة"),
  hoursCount: z.string().min(1, "عدد الساعات مطلوب"),
  category: z.string().min(1, "التصنيف مطلوب"),
  image: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

