import { z } from "zod";

// Schema for individual items in the payment
export const PaymentItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do item é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
  unitValue: z.number().min(0.01, "Valor unitário deve ser maior que 0"),
  totalValue: z.number().min(0.01, "Valor total deve ser maior que 0"),
});

// Main schema for the payment link
export const schemaPaymentLink = z.object({
  id: z.string().optional(),

  // Identificador section
  linkIdentifier: z.string().min(1, "Identificador do link é obrigatório"),
  ecName: z.string().min(1, "Nome do EC é obrigatório"),

  // Mais opções section
  dateOrDay: z.string().optional(),
  expirationTime: z.string().min(1, "Tempo de expiração é obrigatório"),
  maxInstallments: z.string().min(1, "Número máximo de parcelas é obrigatório"),
  paymentType: z.string().min(1, "Tipo de pagamento é obrigatório"),

  // Valor da Cobrança section
  chargeType: z.enum(["single", "items"]),
  totalAmount: z
    .number()
    .min(0.01, "Valor total deve ser maior que 0")
    .optional(),
  items: z.array(PaymentItemSchema).optional(),

  // Additional fields
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  expirationDate: z.date().optional(),
});

// Type for the payment link based on the schema
export type PaymentLinkSchema = z.infer<typeof schemaPaymentLink>;

// Type for payment items based on the schema
export type PaymentItemType = z.infer<typeof PaymentItemSchema>;
