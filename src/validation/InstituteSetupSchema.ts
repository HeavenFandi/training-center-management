import { z } from "zod";

export const InstituteSetupSchema = z
  .object({
    name: z.string().min(1, { message: "اسم المعهد مطلوب" }),
    description: z.string().min(1, { message: "وصف المعهد مطلوب" }),
    location: z.string().min(1, { message: "موقع المعهد مطلوب" }),
    phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
    email: z
      .string()
      .email({ message: "بريد إلكتروني غير صالح" })
      .min(1, { message: "البريد الإلكتروني مطلوب" }),
    workingHoursMain: z
      .array(z.string())
      .min(1, { message: "يرجى اختيار يوم واحد على الأقل" }),
    workingHoursMainTimeFrom: z.string().optional(),
    workingHoursMainTimeTo: z.string().optional(),
    workingHoursMainStatus: z.enum(["open", "closed"]),
  })
  .refine(
    (data) => {
      if (data.workingHoursMainStatus === "open") {
        return data.workingHoursMainTimeFrom && data.workingHoursMainTimeTo;
      }
      return true;
    },
    {
      message: "يرجى تحديد أوقات الدوام",
      path: ["workingHoursMainTimeFrom"],
    },
  );

export type TInstituteSetupType = z.infer<typeof InstituteSetupSchema>;
