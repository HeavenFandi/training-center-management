import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الكنية مطلوبة"),
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z
     .string()
     .min(1, { message: "Password is required" })
     .min(6, { message: "Password must be at least 8 characters longs" })
     .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {
       message: "Password should contain at least 1 special character",
     }),
  phone: z.string().min(7, "رقم الهاتف غير صالح"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  experience: z.string().min(1, "سنوات الخبرة مطلوبة"),
  address: z.string().min(1, "العنوان مطلوب"),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

