import { z } from "zod";

export const hallSchema = z.object({
  hall: z.string().min(1, "رقم القاعة مطلوب"),
  capacity: z.coerce.number().int().min(1, "السعة مطلوبة").max(1000, "السعة يجب أن تكون بين 1 و 1000"),
  equipment: z.string().min(1, "التجهيزات مطلوبة"),
});

export type HallFormData = z.infer<typeof hallSchema>;

