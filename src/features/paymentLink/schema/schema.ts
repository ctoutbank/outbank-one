import { z } from "zod";

// Schema for individual items in the payment
export const PaymentItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  quantity: z.string().optional(),
  totalValue: z.string().optional(),
});

// Main schema for the payment link
export const schemaPaymentLink = z.object({
  id: z.string().optional(),

  // Identificador section
  linkIdentifier: z.string().optional(),
  ecName: z.string().optional(),

  // Mais opções section
  dateOrDay: z.string().optional(),
  expirationTime: z.string().optional(),
  installments: z.string().optional(),
  paymentType: z.string().optional(),
  totalAmount: z.string().optional(),
  items: z.array(PaymentItemSchema).optional(),

  // Additional fields
  active: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  expirationDate: z.date().optional(),
});

// Type for the payment link based on the schema
export type PaymentLinkSchema = z.infer<typeof schemaPaymentLink>;

// Type for payment items based on the schema
export type PaymentItemType = z.infer<typeof PaymentItemSchema>;
