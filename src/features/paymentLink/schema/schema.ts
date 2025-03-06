import { z } from "zod";

export const schemaShoppingItems = z.object({
  slug: z.string().optional(),
  name: z.string(),
  quantity: z.number(),
  amount: z.string(),
  idPaymentLink: z.number().optional(),
});

export const schemaPaymentLink = z.object({
  id: z.number().optional(),
  slug: z.string().optional(),
  linkName: z.string().optional(),
  idMerchant: z.string().optional(),
  dtExpiration: z.string().optional(),
  installments: z.string().optional(),
  totalAmount: z.string().optional(),
  shoppingItems: z.array(schemaShoppingItems).optional(),
  productType: z.string().optional(),
  paymentLinkStatus: z.string().optional(),
  linkUrl: z.string().optional(),
  active: z.boolean().optional(),
  dtinsert: z.string().optional(),
  dtupdate: z.string().optional(),
  diffNumber: z.string().optional(),
  expiresAt: z.string().optional(),
  pixEnabled: z.boolean().optional(),
  transactionSlug: z.string().optional(),
});

export type PaymentLinkSchema = z.infer<typeof schemaPaymentLink>;

export type ShoppingItemsSchema = z.infer<typeof schemaShoppingItems>;
