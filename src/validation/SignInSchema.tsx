import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().min(1, { message: "Email address is required" }).email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 8 characters longs" })
    .regex(/.*[!@#$%^&*()_+|[\]\\:";'<>?,./].*/, {
      message: "Password should contain at least 1 special character",
    }),
});

export type TSignInType = z.infer<typeof SignInSchema>;


