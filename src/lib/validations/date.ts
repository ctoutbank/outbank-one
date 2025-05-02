import { z } from "zod";

export const dateRangeSchema = z
  .object({
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  })
  .refine(
    (data) => {
      // Se uma das datas estiver preenchida, a outra também deve estar
      if (data.dateFrom || data.dateTo) {
        return !!(data.dateFrom && data.dateTo);
      }
      return true;
    },
    {
      message: "Ambas as datas devem ser preenchidas",
      path: ["dateFrom"], // Indica que o erro está relacionado ao campo dateFrom
    }
  );

export function validateDateRange(dateFrom?: Date, dateTo?: Date) {
  try {
    dateRangeSchema.parse({ dateFrom, dateTo });
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "Erro ao validar datas" };
  }
}
