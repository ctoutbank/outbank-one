import { z } from "zod";

export const SchemaFinancialAdjustment = z.object({
  id: z.number().optional(),
  externalId: z.number().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  expectedSettlementDate: z.string().optional(),
  reason: z.string().min(1, "Motivo é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  rrn: z.string().optional(),
  grossValue: z.string().min(1, "Valor bruto é obrigatório"),
  recurrence: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  merchants: z.array(z.number()).optional(), // Array de IDs dos merchants
  idCustomer: z.string().optional(),
});

export type FinancialAdjustmentSchema = z.infer<
  typeof SchemaFinancialAdjustment
>;

export const SchemaFinancialAdjustmentMerchant = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  active: z.boolean().optional(),
  idFinancialAdjustment: z.number(),
  idMerchant: z.number(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type FinancialAdjustmentMerchantSchema = z.infer<
  typeof SchemaFinancialAdjustmentMerchant
>;
