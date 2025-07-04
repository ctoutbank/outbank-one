import { z } from "zod";

export const schemaCategories = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  mcc: z.string().min(1, "MCC é obrigatório"),
  cnae: z.string().min(1, "CNAE é obrigatório"),
  anticipation_risk_factor_cp: z.string().optional(),
  anticipation_risk_factor_cnp: z.string().optional(),
  waiting_period_cp: z.string().optional(),
  waiting_period_cnp: z.string().optional(),
  idSolicitationFee: z.string().optional(),
});

export type CategoriesSchema = z.infer<typeof schemaCategories>;
