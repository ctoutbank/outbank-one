import { z } from "zod";

export const schemaMerchantBank = z.object({
  id: z.number().optional(),
  documentId: z.string().max(14).min(1, "CPF/CNPJ é obrigatório"),
  corporateName: z.string().max(200).min(1, "Campo obrigatório"),
  legalPerson: z.string().max(20).min(1, "Campo obrigatório"),
  bankBranchNumber: z.string().max(4).min(1, "Campo obrigatório"),
  bankBranchCheckDigit: z.string().max(2).optional(),
  accountNumber: z.string().max(15).min(1, "Campo obrigatório"),
  accountNumberCheckDigit: z.string().max(2).optional(),
  accountType: z.string().max(20).min(1, "Campo obrigatório"),
  compeCode: z.string().max(3).min(1, "Campo obrigatório"),
  dtinsert: z.date().optional(),
  dtupdate: z.date().optional(),
});

export type MerchantBankSchema = z.infer<typeof schemaMerchantBank>;
