import { z } from "zod";

export const schemaMerchantBank = z.object({
  id: z.number().optional(),
  documentId: z.string().max(14).min(1),
  corporateName: z.string().max(200).min(1),
  legalPerson: z.string().max(20).min(1),
  bankBranchNumber: z.string().max(4).min(1),
  bankBranchCheckDigit: z.string().max(2).optional(),
  accountNumber: z.string().max(15).min(1),
  accountNumberCheckDigit: z.string().max(2).optional(),
  accountType: z.string().max(20).min(1),
  compeCode: z.string().max(3).min(1),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type MerchantBankSchema = z.infer<typeof schemaMerchantBank>;
