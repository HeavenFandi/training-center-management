import { z } from "zod";

export const examSchema = z.object({
  text: z.string().min(3, "اسم الاختبار مطلوب ويجب أن يتكون من 3 أحرف على الأقل"),
  course: z.string().min(1, "اختر الدورة"),
  date: z.string().min(1, "حدد تاريخ الاختبار"),
  total: z.coerce.number().int().min(1, "العلامة الكاملة مطلوبة ويجب أن تكون أكبر من 0"),
  passMark: z
    .coerce.number()
    .int()
    .min(0, "علامة النجاح مطلوبة")
    .refine((value) => value >= 0, {
      message: "علامة النجاح يجب أن تكون رقمًا صحيحًا صالحًا",
    }),
}).refine((data) => data.passMark <= data.total, {
  message: "علامة النجاح يجب أن تكون أقل من أو تساوي العلامة الكاملة",
  path: ["passMark"],
});

export type ExamFormData = z.infer<typeof examSchema>;

