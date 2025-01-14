import { z } from "zod";

export const schemaSettlements = z.object({
  id: z.bigint().optional(),
  slug: z.string().min(1).max(50).optional(),
  name: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
  batchAmount: z.number().optional(),
  discountFeeAmount: z.number().optional(),
  netSettlementAmount: z.number().optional(),
  totalAnticipationAmount: z.number().optional(),
  totalRestitutionAmount: z.number().optional(),
  pixAmount: z.number().optional(),
  pixNetAmount: z.number().optional(),
  pixFeeAmount: z.number().optional(),
  pixCostAmount: z.number().optional(),
  pendingRestitutionAmount: z.number().optional(),
  totalCreditAdjustmentAmount: z.number().optional(),
  totalDebitAdjustmentAmount: z.number().optional(),
  totalSettlementAmount: z.number().optional(),
  restRoundingAmount: z.number().optional(),
  outstandingAmount: z.number().optional(),
  slugCustomer: z.string().min(1).max(50).optional(),
  status: z.string().min(1).max(50).optional(),
  creditStatus: z.string().min(1).max(50).optional(),
  debitStatus: z.string().min(1).max(50).optional(),
  anticipationStatus: z.string().min(1).max(50).optional(),
  pixStatus: z.string().min(1).max(50).optional(),
  paymentDate: z.date().optional(),
  pendingFinancialAdjustmentAmount: z.number().optional(),
  creditFinancialAdjustmentAmount: z.number().optional(),
  debitFinancialAdjustmentAmount: z.number().optional(),
  
});

export type SettlementsSchema = z.infer<typeof schemaSettlements>;
