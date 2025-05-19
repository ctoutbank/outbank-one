import { z } from "zod";

export const schemaPricingBrandProductType = z.object({
  name: z.string().optional(),
  fee: z.string().optional(),
  feeAdmin: z.string().optional(),
  feeDock: z.string().optional(),
  transactionFeeStart: z.string().optional(),
  transactionFeeEnd: z.string().optional(),
  pixMinimumCostFee: z.string().optional(),
  pixCeilingFee: z.string().optional(),
  transactionAnticipationMdr: z.string().optional(),
});

export const schemaPricingSolicitationBrand = z.object({
  name: z.string().optional(),
  productTypes: z.array(schemaPricingBrandProductType),
});

export const schemaPricingSolicitation = z
  .object({
    cnae: z.string().min(1, "CNAE é obrigatório"),
    mcc: z.string().min(1, "MCC é obrigatório"),
    cnpjsQuantity: z.string().min(1, "Quantidade de CNPJs é obrigatória"),
    ticketAverage: z.string().min(1, "Ticket médio é obrigatório"),
    tpvMonthly: z.string().min(1, "TPV mensal é obrigatório"),
    cnaeInUse: z.boolean().optional().nullable(),
    description: z.string().optional().nullable(),
    brands: z.array(schemaPricingSolicitationBrand).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.cnaeInUse === true) {
        return !!data.description;
      }
      return true;
    },
    {
      message: "Descrição é obrigatória",
      path: ["description"],
    }
  );

export type PricingSolicitationSchema = z.infer<
  typeof schemaPricingSolicitation
>;
