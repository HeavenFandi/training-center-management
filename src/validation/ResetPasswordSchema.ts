import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "كلمة المرور مطلوبة" })
      .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
      .regex(/[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/]/, {
        message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل",
      }),

    confirmPassword: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
  });

export type TResetPasswordType = z.infer<typeof ResetPasswordSchema>;

