import { z } from "zod";

const baseTeacherSchema = z.object({
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
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  phone: z.string().min(7, "رقم الهاتف غير صالح"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  experienceYears: z.coerce.number().min(0, "سنوات الخبرة يجب أن تكون رقمًا صالحًا"),
  address: z.string().min(1, "العنوان مطلوب"),
});

export const teacherSchema = baseTeacherSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  }
);

export type AddTeacherFormData = z.infer<typeof baseTeacherSchema>;

const editTeacherBaseSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الكنية مطلوبة"),
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  certificates: z.string().min(1, "الشهادات مطلوبة"),
  address: z.string().min(1, "العنوان مطلوب"),
  cv: z.string().min(1, "السيرة الذاتية مطلوبة"),
  experienceYears: z.coerce.number().min(0, "سنوات الخبرة يجب أن تكون رقمًا صالحًا"),
});

export const editTeacherSchema = editTeacherBaseSchema.refine(
  (data) => {
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  }
);

export type EditTeacherFormData = z.infer<typeof editTeacherBaseSchema>;

