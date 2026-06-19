import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الاسم الاخير مطلوب"),
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(1, { message: "كلمة المرور مطلوبة" })
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  contactInfo: z.string().min(1, "معلومات الاتصال مطلوبة"),
  gender: z.enum(["ذكر", "أنثى"]),
  birthDate: z
    .string()
    .min(1, "تاريخ الميلاد مطلوب")
    .refine((date) => new Date(date) < new Date(), {
      message: "تاريخ الميلاد يجب أن يكون في الماضي",
    }),
  address: z.string().min(1, "العنوان مطلوب"),
  interest: z.string().min(1, "الاهتمام مطلوب"),
  bio: z.string().min(1, "السيرة الذاتية (Bio) مطلوبة"),
  image: z.string().optional(),
  enrollmentDate: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور وتأكيدها غير متطابقين",
  path: ["confirmPassword"],
});

export type StudentFormData = z.infer<typeof studentSchema>;

