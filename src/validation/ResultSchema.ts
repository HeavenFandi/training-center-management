import { z } from "zod";

export const resultSchema = z.object({
  student: z.string().min(1, "اسم الطالب مطلوب"),
  course: z.string().min(1, "اسم الدورة مطلوب"),
  grade: z.coerce.number().int().min(0, "العلامة مطلوبة").max(100, "العلامة يجب أن تكون بين 0 و 100"),
  status: z.string().min(1, "الحالة مطلوبة").refine(
    (value) => value === "ناجح" || value === "راسب",
    {
      message: "الحالة يجب أن تكون ناجح أو راسب",
    },
  ),
});

export type ResultFormData = z.infer<typeof resultSchema>;

