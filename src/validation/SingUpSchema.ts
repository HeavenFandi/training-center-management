import { z } from "zod";

// Allowed image types and max size (5MB)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "الاسم الأول مطلوب" }),
    lastName: z.string().min(1, { message: "الكنية مطلوبة" }),
    username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
    email: z
      .string()
      .min(1, { message: "البريد الإلكتروني مطلوب" })
      .email({ message: "البريد الإلكتروني غير صالح" }),
    password: z
      .string()
      .min(1, { message: "كلمة المرور مطلوبة" })
      .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
      .regex(/[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?\/]/, {
        message: "يجب أن تحتوي على رمز خاص",
      }),
    confirmPassword: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" }),
    birthDate: z
      .string()
      .min(1, { message: "تاريخ الميلاد مطلوب" })
      .refine((date) => new Date(date) < new Date(), {
        message: "تاريخ الميلاد يجب أن يكون في الماضي",
      }),
    address: z.string().min(1, { message: "العنوان مطلوب" }),
    phoneNumber: z.string().min(10, "رقم الهاتف غير صحيح"),
    gender: z.enum(["ذكر", "أنثى"]),
    bio: z.string().min(1, "Bio is required"),
    profileImage: z
      .any()
      .optional()
      .refine(
        (file) => !file || (file instanceof File && ALLOWED_IMAGE_TYPES.includes(file.type)),
        "الصورة يجب أن تكون من نوع JPG أو PNG"
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_IMAGE_SIZE),
        "الصورة يجب أن تكون أقل من 5 ميجابايت"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
  });

export type SignUpType = z.infer<typeof SignUpSchema>;

