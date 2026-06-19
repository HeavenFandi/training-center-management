import * as z from "zod";

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة"),
});

export type TForgetPasswordType = z.infer<typeof ForgetPasswordSchema>;
